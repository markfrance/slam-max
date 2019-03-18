#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>
#include <eosiolib/singleton.hpp>
#include <eosiolib/time.hpp>
#include <eosiolib/transaction.hpp>
using namespace eosio;
using namespace std;

#define SLAM_MAX_GAME "slammaxxgame"_n

struct st_bet {
    uint64_t id;
    name player;
    name referrer;
    asset amount;
    uint8_t roll_under;
    uint8_t lucky_number;
    capi_checksum256 seed_hash;
    capi_checksum160 user_seed_hash;
    uint64_t created_at;
};

struct st_result {
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

class slammaxxlogs : public contract {
   public:
    slammaxxlogs(name self, name code, datastream<const char*> ds) 
    : contract(self, code, ds){};

    // @abi action
    void result(st_result result);
};

EOSIO_DISPATCH(slammaxxlogs, (result));