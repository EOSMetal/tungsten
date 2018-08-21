#pragma once

#include <eosiolib/asset.hpp>
#include <eosiolib/crypto.h>
#include <eosiolib/eosio.hpp>

using namespace eosio;
using std::string;

namespace models {
    uint64_t string_hasher(string data) {
        checksum256 result;
        sha256((char *)data.c_str(), sizeof(data), &result);
        uint64_t hash = 0;
        for (uint8_t i = 0; i < 8; i++) {
            hash += result.hash[i] << (8u * i);
        }
        return hash;
    }

    //@abi table bonds i64
    struct bond_type {
        uint64_t id;
        account_name creator;
        asset deposit;
        string ricardian;
        uint64_t expiration;
        account_name arbitrator;
        uint32_t active_claims = 0;

        static uint64_t produce_id(account_name creator, string ricardian) {
            return string_hasher(name{creator}.to_string() + ricardian);
        }
        uint64_t primary_key() const { return id; }
    };

    typedef eosio::multi_index<N(bonds), bond_type> bonds_table;

    //@abi table claims i64
    struct claim_type {
        uint64_t id;
        account_name claimer;
        uint64_t bond_id;
        asset amount;
        string details;
        string language;
        uint64_t expiration;

        static uint64_t produce_id(account_name claimer, uint64_t bond_id, string details) {
            return string_hasher(name{claimer}.to_string() +
                                 std::to_string(bond_id) +
                                 details);
        }
        uint64_t primary_key() const { return id; }
    };

    typedef eosio::multi_index<N(claims), claim_type> claims_table;
}

using namespace models;

class tungsten : public contract {
  public:
    using contract::contract;

    const uint64_t claim_expiration = 7 * 24 * 60 * 60;
    const uint64_t claim_expiration_extension = 24 * 60 * 60;
    const float claim_security_deposit = 0.1;
    const float arbitrator_fee = 0.2;

    void createbond(account_name creator, asset deposit,
                    string ricardian, uint64_t expiration,
                    account_name arbitrator);
    void renewbond(uint64_t bond_id, uint64_t expiration);
    void closebond(uint64_t bond_id);
    void createclaim(account_name claimer, uint64_t bond_id,
                     asset amount, string details, string language);
    void delayclaim(uint64_t claim_id);
    void ruleclaim(uint64_t claim_id, bool authorize, string details);
    void closeclaim(uint64_t claim_id);
};

EOSIO_ABI(tungsten, (createbond)(renewbond)(closebond)(createclaim)(delayclaim)(ruleclaim)(closeclaim))
