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
    auto &bond = bonds.get(bond_id, "Unable to find bond with the provided ID");

    require_auth(bond.creator);

    eosio_assert(expiration > bond.expiration, "New expiration time should be after the current one");

    bonds.modify(bond, 0, [&expiration](bond_type &bond) {
        bond.expiration = expiration;
    });
}

void tungsten::closebond(uint64_t bond_id) {
    bonds_table bonds(_self, bond_id);
    auto &bond = bonds.get(bond_id, "Unable to find bond with the provided ID");

    require_auth(bond.creator);

    eosio_assert(bond.active_claims == 0, "Cannot close a bond that still has active claims");
    eosio_assert(bond.expiration <= now(), "Bond has not expired yet");

    bonds.erase(bond);

    action(permission_level{_self, N(active)},
           N(eosio.token), N(transfer),
           std::make_tuple(_self, bond.creator, bond.deposit,
                           string("Close bond ") + std::to_string(bond.id)))
        .send();
}

void tungsten::createclaim(account_name claimer, uint64_t bond_id,
                           asset amount, string details, string language) {
    require_auth(claimer);

    bonds_table bonds(_self, bond_id);
    auto &bond = bonds.get(bond_id, "Unable to find bond with the provided ID");

    eosio_assert(amount.symbol == asset().symbol, "Claimed amount must be in the system token");
    eosio_assert(amount.amount > 0, "Claimed amount must be greater than zero");
    eosio_assert(bond.deposit.amount > 0, "There are no funds remaining in the deposit of the bond");
    eosio_assert(details.length() > 0, "Must provide details of the claim");
    eosio_assert(language.length() > 0, "Must provide language of the details of the claim");

    bonds.modify(bond, 0, [&](bond_type &bond) {
        bond.active_claims++;
    });

    uint64_t id = claim_type::produce_id(claimer, bond_id, details);
    claims_table claims(_self, id);
    claims.emplace(claimer, [&](claim_type &claim) {
        claim.id = id;
        claim.claimer = claimer;
        claim.bond_id = bond_id;
        claim.amount = amount;
        claim.details = details;
        claim.language = language;
        claim.expiration = now() + this->claim_expiration;
    });

    action(permission_level{claimer, N(active)},
           N(eosio.token), N(transfer),
           std::make_tuple(claimer, _self, asset(amount.amount * this->claim_security_deposit),
                           string("Security deposit for claim ") + std::to_string(id)))
        .send();
}

void tungsten::delayclaim(uint64_t claim_id) {
    claims_table claims(_self, claim_id);
    auto &claim = claims.get(claim_id, "Unable to find claim with the provided ID");
    bonds_table bonds(_self, claim.bond_id);
    auto &bond = bonds.get(claim.bond_id, "Unable to find bond associated with the claim");

    require_auth(bond.arbitrator);

    eosio_assert(claim.expiration > now(), "This claim has already expired");

    claims.modify(claim, 0, [this](claim_type &claim) {
        claim.expiration = now() + this->claim_expiration_extension;
    });
}

void tungsten::ruleclaim(uint64_t claim_id, bool authorize, string details) {
    claims_table claims(_self, claim_id);
    auto &claim = claims.get(claim_id, "Unable to find claim with the provided ID");
    bonds_table bonds(_self, claim.bond_id);
    auto &bond = bonds.get(claim.bond_id, "Unable to find bond associated with the claim");

    require_auth(bond.arbitrator);

    eosio_assert(claim.expiration > now(), "Claim has already expired");
    eosio_assert(bond.deposit.amount > 0, "Cannot rule a claim on a bond with a depleted deposit");

    asset balance = asset(claim.amount.amount * this->claim_security_deposit);
    asset arbitrator_fee = asset(balance.amount * this->arbitrator_fee);
    balance -= arbitrator_fee;

    action(permission_level{_self, N(active)},
           N(eosio.token), N(transfer),
           std::make_tuple(_self, bond.arbitrator, arbitrator_fee,
                           string("Arbitration fee for claim ") + std::to_string(claim_id)))
        .send();

    if (authorize) {
        if (claim.amount <= bond.deposit) {
            balance += claim.amount;
            bonds.modify(bond, 0, [&](bond_type &bond) {
                bond.deposit -= claim.amount;
            });
        } else {
            balance += bond.deposit;
            bonds.modify(bond, 0, [&](bond_type &bond) {
                bond.deposit = asset(0);
            });
        }
        action(permission_level{_self, N(active)},
               N(eosio.token), N(transfer),
               std::make_tuple(_self, claim.claimer, balance,
                               string("Claimed on approved claim ") + std::to_string(claim_id)))
            .send();
    } else {
        action(permission_level{_self, N(active)},
               N(eosio.token), N(transfer),
               std::make_tuple(_self, bond.creator, balance,
                               string("Compensation for rejected claim ") + std::to_string(claim_id)))
            .send();
    }

    claims.erase(claim);
    bonds.modify(bond, 0, [](bond_type &bond) {
        bond.active_claims--;
    });
}

void tungsten::closeclaim(uint64_t claim_id) {
    claims_table claims(_self, claim_id);
    auto &claim = claims.get(claim_id, "Unable to find claim with the provided ID");
    bonds_table bonds(_self, claim.bond_id);
    auto &bond = bonds.get(claim.bond_id, "Unable to find bond associated with the claim");

    require_auth(claim.claimer);

    eosio_assert(now() >= claim.expiration || bond.deposit.amount == 0,
                 "Cannot close a claim that hasn't expired yet and still has funds to claim");

    action(permission_level{_self, N(active)},
           N(eosio.token), N(transfer),
           std::make_tuple(_self, claim.claimer, asset(claim.amount.amount * this->claim_security_deposit),
                           string("Closed claim ") + std::to_string(claim_id)))
        .send();

    claims.erase(claim);
    bonds.modify(bond, 0, [](bond_type &bond) {
        bond.active_claims--;
    });
}
