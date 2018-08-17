Input (Our smart contract) 

Bond contract Issuing Action Input (Issuer)
 - EOS Account that issues the bond
 - N amount of EOS
 - Time Frame (duration of the bond)
 - Selected RC that bond apply to (On chain or new one)
 - Selected Arb
 - Optional: enforce multisig
 - Optional: enforce arb bond with minimum

Arb registering action

Arb/Ruling Input( what comes from arbs on forum after hearing)
 - Claim id
 - Decision content (memo field)
 - decision input (boolean: in favour or not)
 - EOS quantity

Fill Claim Action Input (Compliantant)
 - EOS Account of the claimer
 - Claim content (memo field)
 - Language
 - Bond id
 - Claim in EOS
 - 10%? Of the claim in escrow (if claimant loses the dispute this goes to defendant)

Claim Reward Action Input (Compliantant)
 - Original complain id

Further dev:

Fees:
 - Fixed claiming fee (Who gets that fee? The arb?)
 - Pct of the claim / fixed amount if the arb rules in favor of the claimant
 - ¿Periodic fee from the bond to the arb?

Display (web UI)
 - Dashboard Search / filters / sorting
 - Pushing actions through scatter
 - Dashboard with list of bonds, with filter/sorting
 - Display bonds, time to expiration and other info from the bonds
