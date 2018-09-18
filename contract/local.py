import node
import sess
import eosf
import os
import json

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
token = eosf.account(sess.eosio, name='eosio.token')
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

# Load tungsten contract
tungsten = eosf.account(sess.eosio, name='tungsten')
sess.wallet.import_key(tungsten)
tungsten = eosf.Contract(tungsten, os.path.join(os.getcwd(), 'contract'))
tungsten.deploy()

# Give the contract the necessary permissions from the accounts
bios = eosf.Contract(sess.eosio, 'eosio.bios')
authority = dict(
    threshold=1,
    keys=[dict(
        key='',
        weight=1)],
    accounts=[dict(
        permission=dict(actor=tungsten.account.name, permission='eosio.code'),
        weight=1)],
    waits=[])

authority['keys'][0]['key'] = tungsten.account.active_key.key_public
bios.push_action(
    'updateauth',
    json.dumps([tungsten.account.name, 'active', 'owner', authority]),
    tungsten.account)
authority['keys'][0]['key'] = bonder.active_key.key_public
bios.push_action(
    'updateauth',
    json.dumps([bonder.name, 'active', 'owner', authority]),
    bonder)
authority['keys'][0]['key'] = claimer.active_key.key_public
bios.push_action(
    'updateauth',
    json.dumps([claimer.name, 'active', 'owner', authority]),
    claimer)

# To make the contract account privileged instead - removes the need for permissions
# eosf.Contract(sess.eosio, 'eosio.bios').push_action(
#     'setpriv', '["{}", 1]'.format(tungsten.account))
