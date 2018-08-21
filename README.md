# Bond Contract

This contract allows users to place a stake that will act as a security deposit
for the fulfillment of a Ricardian contract.

It will also allow users who have entered said contract to file claims on the
security deposit in case there is a breach of contract or failure in its fulfillment.

The claims will be evaluated by the appointed arbitrators declared upon the creation
of the bond by its creator.

## Actions:
- `createbond`
  - Parameters:
    - `creator`: User creating the bond.
    - `deposit`: Amount to deposit.
    - `ricardian`: Ricardian contract.
    - `expiration`: Expiration date.
    - `arbitrator`: Arbitrator account.
  - Required authorization: `creator` account.
  - Effect: Creates a bond and locks the deposit until the expiration date.
- `renewbond`
  - Parameters:
    - `bond_id`: ID of the bond.
    - `expiration`: New expiration date.
  - Required authorization: `creator` of the bond.
  - Effect: Extends the expiration date of the bond.
- `closebond`
  - Parameters:
    - `bond_id`: ID of the bond.
  - Required authorization: `creator` or `arbitrator` of the bond.
  - Effect:
    - If expiration date has passed and there are no open claims,
      closes the bond and withdraws the deposit.
    - If run by the bond's arbitrator, forcefully closes it.
- `createclaim`
  - Parameters:
    - `claimer`: User making the claim.
    - `bond_id`: ID of the bond.
    - `amount`: Amount of the security deposit requested in the claim.
    - `details`: Details of the claim.
    - `language`: Language of the claim details.
  - Required authorization: `claimer`.
  - Effect: Creates a new claim and stores it in the contract. It will also
    send 10% of the claimed amount from the `claimer`'s funds to the contract
    to lock it as security deposit of the claim itself, in case it is ruled
    against the claimer.
- `delayclaim`
  - Parameters:
    - `claim_id`: ID of the claim.
  - Required authorization: `arbitrator` of the bond associated to the claim.
  - Effect: Pushes the expiration date of the claim by a fixed amount.
- `ruleclaim`
  - Parameters:
    - `claim_id`: ID of the claim.
    - `authorize`: Verdict of whether the arbitrator authorizes the claim
      of funds by the `claimer` or denies it.
    - `details`: Details of the resolution.
  - Required authorization: `arbitrator` of the bond associated to the claim.
  - Effect: Closes the claim, extracts the arbitrator fee from the claim's
    security deposit and, depending on the `authorize` parameter, it either
    pays the claimed amount to the `claimer` plus the rest of their deposit or
    pays the rest of that deposit to the creator of the bond as compensation.
- `closeclaim`
  - Parameters:
    - `claim_id`: ID of the claim.
  - Required authorization: User who created the claim (`claimer`).
  - Effect:
    - If expiration date of the claim has passed, returns the security
      deposit to the `claimer` and closes the claim.
    - Before claim expiration date, if the bond's deposit is empty, returns
      the claim's security deposit to the `claimer` and closes the claim.

## Usage example

- `UserA` creates a bond for 10000 EOS using `createbond`.
- `UserB` thinks `UserA` broke the contract and files a claim using `createclaim`.
- The arbitrator of the `UserA` bond makes a decision and calls `ruleclaim`.
- The penalties and gains are distributed accordingly.

## Possible improvements

- Allow arbitrators to adjust the amount being requested by the claimers
  in their ruling.
- Allow arbitrators to "take" a claim, in order to signal that they have
  started investigating it.
- Allow bond creators to authorize a claim if they agree with it, without
  the need of arbitrator intervention.
- Allow arbitrators to only rule claims in order of submission or some
  other important criteria.
- Allow bond creators to refill the security deposit of their bond with
  more funds.
