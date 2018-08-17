#include "tungsten.hpp"

void tungsten::createbond(account_name creator, asset deposit,
                          string ricardian, uint64_t expiration,
                          account_name arbitrator) {
    require_auth(creator);

    eosio_assert(deposit.symbol == asset().symbol, "Deposit must be in the system token");
    eosio_assert(deposit.amount > 0, "Deposit amount must be greater than zero");
    eosio_assert(ricardian.length() > 0, "Ricardian contract is required");
    eosio_assert(expiration > now(), "Expiration date must be in the future");
    eosio_assert(is_account(arbitrator), "Arbitrator must be a real account");

    uint64_t id = bond_type::produce_id(creator, ricardian);
    bonds_table bonds(_self, id);
    bonds.emplace(creator, [&](bond_type &bond) {
        bond.id = id;
        bond.creator = creator;
        bond.deposit = deposit;
        bond.ricardian = ricardian;
        bond.expiration = expiration;
        bond.arbitrator = arbitrator;
    });

    action(permission_level{creator, N(active)},
           N(eosio.token), N(transfer),
           std::make_tuple(creator, _self, deposit,
                           string("Security deposit for bond ") + std::to_string(id)))
        .send();
}

void tungsten::renewbond(uint64_t bond_id, uint64_t expiration) {
    bonds_table bonds(_self, bond_id);
    bond_type bond = bonds.get(bond_id, "Unable to find bond with the provided ID");
    eosio_assert(expiration > bond.expiration, "New expiration time should be after the current one");
    bonds.modify(bond, 0, [&expiration](bond_type &bond) {
        bond.expiration = expiration;
    });
}

void tungsten::closebond(uint64_t bond_id) {
}

void tungsten::createclaim(account_name claimer, uint64_t bond_id,
                           asset amount, string details, string language) {
}

void tungsten::delayclaim(uint64_t claim_id) {
    claims_table claims(_self, claim_id);
    claim_type claim = claims.get(claim_id, "Unable to find claim with the provided ID");
    eosio_assert(claim.expiration > now(), "This claim has already expired");
    eosio_assert(!claim.ruled, "This claim has already been ruled");
    claims.modify(claim, 0, [](claim_type &claim) {
        claim.expiration = now() + 24 * 60 * 60;
    });
}

void tungsten::ruleclaim(uint64_t claim_id, bool authorize, string details) {
}

void tungsten::closeclaim(uint64_t claim_id) {
}
