#include "slammaxxlogs.hpp"

[[eosio::action]]
void slammaxxlogs::result(st_result result) {
    require_auth(SLAM_MAX_GAME);
    require_recipient(result.player);
}