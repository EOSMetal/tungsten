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
                  '["{}", "1000.0000 SYS"]'.format(bonder),
                  token.account)
token.push_action('issue',
                  '["{}", "1000.0000 SYS"]'.format(claimer),
                  token.account)

# Load tungsten contract and make it privileged
tungsten = eosf.account(sess.eosio)
sess.wallet.import_key(tungsten)
tungsten = eosf.Contract(tungsten, os.getcwd())
tungsten.deploy()
eosf.Contract(sess.eosio, 'eosio.bios').push_action(
    'setpriv', '["{}", 1]'.format(tungsten.account))

# Create a bond
in_a_week = int(time.time()) + 7 * 24 * 60 * 60
data = '["{}", "1000.0000 SYS", "Ricardian contract", {}, "{}"]'.format(
    bonder, in_a_week, arbitrator)
action = tungsten.push_action('createbond', data, bonder)

# TODO: Test the rest of the actions
