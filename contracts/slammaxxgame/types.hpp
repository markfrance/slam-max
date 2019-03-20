#include "utils.hpp"

#define EOS_SYMBOL symbol("EOS", 4)
#define SLAM_SYMBOL symbol("SLAM", 8)
#define REVEALER "gamerevealer"_n
#define LOG "slammaxxlogs"_n

static const string PUB_KEY =
    "EOS4wpa8kRBbZof9JEpPAAgbnN65NhbBobW4x5gyxQoFfamhQCAMX";


struct [[eosio::contract("slammaxxgame"), eosio::table]] st_bet {
    uint64_t id;
    name player;
    name referrer;
    asset amount;
    uint8_t roll_under;
    uint8_t lucky_number;
    capi_checksum256 seed_hash;
    capi_checksum160 user_seed_hash;
    uint64_t created_at;
    uint64_t primary_key() const { return id; }
};

struct [[eosio::contract("slammaxxgame"), eosio::table]] st_result {
    uint64_t bet_id;
    name player;
    name referrer;
    asset amount;
    uint8_t roll_under;
    uint8_t lucky_number;
    uint8_t random_roll;
    capi_checksum256 seed;
    capi_checksum256 seed_hash;
    capi_checksum160 user_seed_hash;
    asset payout;
};


struct [[eosio::contract("slammaxxgame"), eosio::table]] st_hash {
    capi_checksum256 hash;
    uint64_t expiration;
    uint64_t primary_key() const { return uint64_hash(hash); }

    uint64_t byexpiration() const { return expiration; }
};


struct [[eosio::contract("slammaxxgame"), eosio::table]] st_fund_pool {
    asset locked;
};


struct [[eosio::contract("slammaxxgame"), eosio::table]] st_global {
    uint64_t current_id;
};

typedef multi_index<"bets"_n, st_bet> tb_bets;
typedef singleton<"fundpool"_n, st_fund_pool> tb_fund_pool;
typedef singleton<"global"_n, st_global> tb_global;
typedef multi_index<
    "hash"_n,
    st_hash,
    indexed_by<"byexpiration"_n,
               const_mem_fun<st_hash, uint64_t, &st_hash::byexpiration>>>
    tb_hash;
    