#include <algorithm>
#include <eosiolib/transaction.hpp>

#include "eosio.token.hpp"
#include "types.hpp"

class [[eosio::contract("slammaxxgame")]] slammaxxgame : public contract {
   public:
    slammaxxgame(name receiver, name code, datastream<const char*> ds)
    :
        contract(receiver, code, ds),
        _hash(receiver, code.value),
        _bets(receiver, code.value),
        _fund_pool(receiver, code.value),
        _global(receiver,code.value){};

    [[eosio::action]]
    void transfer(const name& from, const name& to, const asset& quantity, const string& memo, const symbol& sym);

    [[eosio::action]]
    void receipt(const st_bet& bet, const symbol& sym);

    [[eosio::action]]
    void reveal(const uint64_t& id, const capi_checksum256& seed, const symbol& sym);

   private:
    tb_bets _bets;
    tb_fund_pool _fund_pool;
    tb_hash _hash;
    tb_global _global;

    void parse_memo(string memo,
                    uint8_t* roll_under,
                    uint8_t* lucky_number,
                    capi_checksum256* seed_hash,
                    capi_checksum160* user_seed_hash,
                    uint64_t* expiration,
                    name* referrer,
                    signature* sig) {
        // remove space
        memo.erase(std::remove_if(memo.begin(),
                                  memo.end(),
                                  [](unsigned char x) { return std::isspace(x); }),
                   memo.end());

        size_t sep_count = std::count(memo.begin(), memo.end(), '-');
        eosio_assert(sep_count == 5, "invalid memo");

        size_t pos;
        string container;
        pos = sub2sep(memo, &container, '-', 0, true);
        eosio_assert(!container.empty(), "no roll under");
        *roll_under = stoi(container);
        pos = sub2sep(memo, &container, '-', ++pos, true);
        eosio_assert(!container.empty(), "no seed hash");
        *seed_hash = hex_to_sha256(container);
        pos = sub2sep(memo, &container, '-', ++pos, true);
        eosio_assert(!container.empty(), "no user seed hash");
        *user_seed_hash = hex_to_sha1(container);
        pos = sub2sep(memo, &container, '-', ++pos, true);
        eosio_assert(!container.empty(), "no expiration");
        *expiration = stoull(container);
        pos = sub2sep(memo, &container, '-', ++pos, true);
        eosio_assert(!container.empty(), "no referrer");
        *referrer = name(container.c_str());
        container = memo.substr(++pos);
        eosio_assert(!container.empty(), "no signature");
        *sig = str_to_sig(container);
    }

    uint8_t compute_random_roll(const capi_checksum256& seed1, const capi_checksum160& seed2) {
        size_t hash = 0;
        hash_combine(hash, sha256_to_hex(seed1));
        hash_combine(hash, sha1_to_hex(seed2));
        return hash % 100 + 1;
    }

    asset compute_referrer_reward(const st_bet& bet) { return bet.amount / 200; }

    uint64_t next_id() {
        st_global global = _global.get_or_default(
            st_global{.current_id = _bets.available_primary_key()});
        global.current_id += 1;
        _global.set(global, _self);
        return global.current_id;
    }

    string referrer_memo(const st_bet& bet) {
        string memo = "bet id:";
        string id = uint64_string(bet.id);
        memo.append(id);
        memo.append(" player: ");
        string player = name{bet.player}.to_string();
        memo.append(player);
        memo.append(" referral reward! - slam max");
        return memo;
    }

    string winner_memo(const st_bet& bet) {
        string memo = "bet id:";
        string id = uint64_string(bet.id);
        memo.append(id);
        memo.append(" player: ");
        string player = name{bet.player}.to_string();
        memo.append(player);
        memo.append(" winner! - slam max");
        return memo;
    }

    st_bet find_or_error(const uint64_t& id) {
        auto itr = _bets.find(id);
        eosio_assert(itr != _bets.end(), "bet not found");
        return *itr;
    }

    void assert_hash(const capi_checksum256& seed_hash, const uint64_t& expiration) {
        const uint32_t _now = now();

        // check expiration
        eosio_assert(expiration > _now, "seed hash expired");

        // check hash duplicate
        const uint64_t key = uint64_hash(seed_hash);
        auto itr = _hash.find(key);
        eosio_assert(itr == _hash.end(), "hash duplicate");

        // clean up
        auto index = _hash.get_index<"byexpiration"_n>();
        auto upper_itr = index.upper_bound(_now);
        auto begin_itr = index.begin();
        auto count = 0;
        while ((begin_itr != upper_itr) && (count < 3)) {
            begin_itr = index.erase(begin_itr);
            count++;
        }

        // save hash
        _hash.emplace(_self, [&](st_hash& r) {
            r.hash = seed_hash;
            r.expiration = expiration;
        });
    }

    void assert_quantity(const asset& quantity) {
        eosio_assert(quantity.symbol == EOS_SYMBOL 
            || quantity.symbol == SLAM_SYMBOL, "only EOS token allowed");
        eosio_assert(quantity.is_valid(), "quantity invalid");
        eosio_assert(quantity.amount >= 1000, "transfer quantity must be greater than 0.1");
    }

    void assert_roll_under(const uint8_t& roll_under, const asset& quantity, const symbol& sym) {
        eosio_assert(roll_under >= 2 && roll_under <= 96,
                     "roll under overflow, must be greater than 2 and less than 96");
        eosio_assert(
            max_payout(roll_under, quantity) <= max_bonus(sym),
            "offered overflow, expected earning is greater than the maximum bonus");
    }

    void save(const st_bet& bet) {
        _bets.emplace(_self, [&](st_bet& r) {
            r.id = bet.id;
            r.player = bet.player;
            r.referrer = bet.referrer;
            r.amount = bet.amount;
            r.roll_under = bet.roll_under;
            r.lucky_number = bet.lucky_number;
            r.seed_hash = bet.seed_hash;
            r.user_seed_hash = bet.user_seed_hash;
            r.created_at = bet.created_at;
        });
    }

    void remove(const st_bet& bet) { _bets.erase(bet); }

    void unlock(const asset& amount, const symbol& sym) {
        st_fund_pool pool = get_fund_pool(sym);
        pool.locked -= amount;
        eosio_assert(pool.locked.amount >= 0, "fund unlock error");
        _fund_pool.set(pool, _self);
    }

    void lock(const asset& amount, const symbol& sym) {
        st_fund_pool pool = get_fund_pool(sym);
        pool.locked += amount;
        _fund_pool.set(pool, _self);
    }

    asset compute_payout(const uint8_t& roll_under, const asset& offer, symbol sym) {
        return min(max_payout(roll_under, offer), max_bonus(sym));
    }

    asset max_payout(const uint8_t& roll_under, const asset& offer) {
        const double ODDS = 98.0 / ((double)roll_under - 1.0);
        return asset(ODDS * offer.amount, offer.symbol);
    }

    asset max_bonus(const symbol& sym) { return available_balance(sym) / 100; }

    asset available_balance(const symbol& sym) {
        
        const asset balance =
            get_balance(_self, sym.code());
        const asset locked = get_fund_pool(sym).locked;
        const asset available = balance - locked;
        eosio_assert(available.amount >= 0, "fund pool overdraw");
        return available;
        
    }

    asset get_balance(name account, symbol_code code)
    {
        asset account_balance = token::get_balance("eosio.token"_n, account, code);
        return account_balance;
    }

    st_fund_pool get_fund_pool(symbol sym) {
        st_fund_pool fund_pool{.locked = asset(0, sym)};
        return _fund_pool.get_or_create(_self, fund_pool);
    }

    void assert_signature(const uint8_t& roll_under,
                          const uint8_t& lucky_number,
                          const capi_checksum256& seed_hash,
                          const uint64_t& expiration,
                          const name& referrer,
                          const signature& sig) {
        string data = uint64_string(roll_under);
        data += "-";
        data += sha256_to_hex(seed_hash);
        data += "-";
        data += uint64_string(expiration);
        data += "-";
        data += name{referrer}.to_string();

        capi_checksum256 digest;
        const char* data_cstr = data.c_str();
        sha256(data_cstr, strlen(data_cstr), &digest);
        public_key key = str_to_pub(PUB_KEY, false);
        assert_recover_key(&digest,
                           (char*)&sig.data,
                           sizeof(sig.data),
                           (char*)&key.data,
                           sizeof(key.data));
    }

    void assert_seed(const capi_checksum256& seed, const capi_checksum256& hash) {
        string seed_str = sha256_to_hex(seed);
        assert_sha256(seed_str.c_str(),
                      strlen(seed_str.c_str()),
                      (const capi_checksum256*)&hash);
    }

    template <typename... Args>
    void send_defer_action(Args&&... args) {
        transaction trx;
        trx.actions.emplace_back(std::forward<Args>(args)...);
        trx.send(next_id(), _self, false);
    }

};


extern "C" { 
    void apply( uint64_t receiver, uint64_t code, uint64_t action ) { 
        if((code == "eosio.token"_n.value && action == "transfer"_n.value) ) { 

                eosio::execute_action(eosio::name(receiver), eosio::name(code), &slammaxxgame::transfer);

           }else if(code == receiver){

                switch( action ) { 
                    EOSIO_DISPATCH_HELPER( slammaxxgame, (transfer)(receipt) ) 
                } 
            eosio_exit(0);
        } 

    } 
} 

