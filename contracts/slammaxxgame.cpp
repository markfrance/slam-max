#include "slammaxxgame.hpp"

[[eosio::action]]
void slammaxxgame::reveal(const uint64_t& id, const capi_checksum256& seed,const symbol& sym) {
    require_auth(REVEALER);
    st_bet bet = find_or_error(id);
    assert_seed(seed, bet.seed_hash);

    uint8_t random_roll = compute_random_roll(seed, bet.user_seed_hash);
    asset payout = asset(0, sym);
    if (random_roll < bet.roll_under 
      || random_roll == bet.lucky_number) {
        payout = compute_payout(bet.roll_under, bet.amount, sym);
        action(permission_level{_self, "active"_n},
               "eosio.token"_n,
               "transfer"_n,
               make_tuple(_self, bet.player, payout, winner_memo(bet)))
            .send();
    }
    unlock(bet.amount, sym);
    if (bet.referrer != _self) {

        send_defer_action(permission_level{_self, "active"_n},
                          "eosio.token"_n,
                          "transfer"_n,
                          make_tuple(_self,
                                     bet.referrer,
                                     compute_referrer_reward(bet),
                                     referrer_memo(bet)));
    }
    remove(bet);
    st_result result{.bet_id = bet.id,
                     .player = bet.player,
                     .referrer = bet.referrer,
                     .amount = bet.amount,
                     .roll_under = bet.roll_under,
                     .lucky_number = bet.lucky_number,
                     .random_roll = random_roll,
                     .seed = seed,
                     .seed_hash = bet.seed_hash,
                     .user_seed_hash = bet.user_seed_hash,
                     .payout = payout};

    send_defer_action(permission_level{_self, "active"_n},
                      LOG,
                      "result"_n,
                      result);
}

[[eosio::action]]
void slammaxxgame::transfer(const name& from,
                            const name& to,
                            const asset& quantity,
                            const string& memo,
                            const symbol& sym) {
    if (from == _self || to != _self) {
        return;
    }
    if ("Transfer bonus" == memo) {
        return;
    }

    uint8_t roll_under;
    uint8_t lucky_number;
    capi_checksum256 seed_hash;
    capi_checksum160 user_seed_hash;
    uint64_t expiration;
    name referrer;
    signature sig;

    parse_memo(memo, &roll_under, &lucky_number, &seed_hash, &user_seed_hash, &expiration, &referrer, &sig);

    //check quantity
    assert_quantity(quantity);

    //check roll_under
    assert_roll_under(roll_under, quantity, sym);

    //check seed hash && expiration
    assert_hash(seed_hash, expiration);

    //check referrer
    eosio_assert(referrer != from, "referrer can not be self");

    //check signature
    assert_signature(roll_under, lucky_number, seed_hash, expiration, referrer, sig);

    const st_bet _bet{.id = next_id(),
                      .player = from,
                      .referrer = referrer,
                      .amount = quantity,
                      .roll_under = roll_under,
                      .lucky_number = lucky_number,
                      .seed_hash = seed_hash,
                      .user_seed_hash = user_seed_hash,
                      .created_at = now()};
    save(_bet);
    lock(quantity, sym);
    action(permission_level{_self, "active"_n},
           _self,
           "receipt"_n,
           _bet)
        .send();
}

[[eosio::action]]
void slammaxxgame::receipt(const st_bet& bet, const symbol& sym) {
    require_auth(_self);
}