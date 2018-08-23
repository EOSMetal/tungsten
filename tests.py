import node
import sess
import eosf
import os
import time

node.reset()
sess.init()

# Create accounts
bonder = eosf.account(sess.eosio)
sess.wallet.import_key(bonder)

claimer = eosf.account(sess.eosio)
sess.wallet.import_key(claimer)

arbitrator = eosf.account(sess.eosio)
sess.wallet.import_key(arbitrator)

# Load eosio.token contract
token = eosf.account(sess.eosio, name="eosio.token")
sess.wallet.import_key(token)
token = eosf.Contract(token, 'eosio.token')
token.deploy()

# Create and issue system token
token.push_action('create',
                  '["{}", "1000000000.0000 SYS"]'.format(token.account),
                  token.account)
token.push_action('issue',
                  '["{}", "10000.0000 SYS"]'.format(bonder),
                  token.account)
token.push_action('issue',
                  '["{}", "10000.0000 SYS"]'.format(claimer),
                  token.account)

# Load tungsten contract and make it privileged
tungsten = eosf.account(sess.eosio)
sess.wallet.import_key(tungsten)
tungsten = eosf.Contract(tungsten, os.getcwd())
tungsten.deploy()
eosf.Contract(sess.eosio, 'eosio.bios').push_action(
    'setpriv', '["{}", 1]'.format(tungsten.account))

# Create a bond
bond_name = 'mydappbond'
in_a_week = int(time.time()) + 7 * 24 * 60 * 60
data = '["{}", "{}", "1000.0000 SYS", "Ricardian contract", {}, "{}"]'.format(
    bonder, bond_name, in_a_week, arbitrator)
tungsten.push_action('createbond', data, bonder)

# Extend expiration date of the bond
tungsten.push_action(
    'renewbond',
    '["{}", {}]'.format(bond_name, in_a_week + 24 * 60 * 60),
    bonder)

# Create a bond that expires soon and then close it once expired
soon = int(time.time()) + 3
data = '["{}", "expiredbond", "100.0000 SYS", "Another ricardian contract", {}, "{}"]'.format(
    bonder, soon, arbitrator)
tungsten.push_action('createbond', data, bonder)
time.sleep(3)
tungsten.push_action('closebond', '["expiredbond"]', bonder)

# File 3 claims on the bond
claim_name_1 = 'repayme1'
data = '["{}", "{}", "{}", "100.0000 SYS", "Details of claim", "English"]'.format(
    claimer, bond_name, claim_name_1)
tungsten.push_action('createclaim', data, claimer)

claim_name_2 = 'repayme2'
data = '["{}", "{}", "{}", "1000.0000 SYS", "Details of claim", "English"]'.format(
    claimer, bond_name, claim_name_2)
tungsten.push_action('createclaim', data, claimer)

claim_name_3 = 'repayme3'
data = '["{}", "{}", "{}", "10.0000 SYS", "Details of claim", "English"]'.format(
    claimer, bond_name, claim_name_3)
tungsten.push_action('createclaim', data, claimer)

# Delay a claim's expiration for further investigation
tungsten.push_action('delayclaim', '["{}"]'.format(claim_name_1), arbitrator)

# Rule denying the first claim
tungsten.push_action(
    'ruleclaim',
    '["{}", false, "Does not make sense"]'.format(claim_name_1),
    arbitrator)

# Rule approving the second claim
tungsten.push_action(
    'ruleclaim',
    '["{}", true, "Makes sense"]'.format(claim_name_2),
    arbitrator)

# Close the third claim since it has no funds left to claim from the bond
tungsten.push_action('closeclaim', '["{}"]'.format(claim_name_3), claimer)
