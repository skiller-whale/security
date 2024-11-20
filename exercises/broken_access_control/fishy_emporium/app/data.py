
# Mocks a database storing username/password combinations
# This is obviously _really insecure_ and it's only used for demo purposes.

USERS = {
    10: {
        'id': 10,
        'username': 'alice',
        'name': 'Alice Pleasance Liddell',
        'address': 'Westminster, London, England',
        'age': 20,
        'is_admin': False,
        'is_public': False,
        'password_hash': 'scrypt:32768:8:1$RP7vp8Dzg0mehYWm$df5c40464fdb0c79e657df87c75fba52429352783c8f6227f3da7a7d3c352d46dca70b51db9464bfb1e951ee89258bf6a8125f63dd937284a39f9a9a8fe4b957'
    },
    9: {
        'id': 9,
        'username': 'bob',
        'name': 'Robert Norman Ross',
        'address': 'Daytona Beach, Florida, U.S.',
        'age': 45,
        'is_admin': True,
        'is_public': False,
        'password_hash': None
    }, # you cannot login as bob/no password set
    12: {
        'id': 12,
        'username': 'charlie',
        'name': 'Sir Charles Spencer Chaplin',
        'address': 'London, England',
        'age': 72,
        'is_admin': False,
        'is_public': False,
        'password_hash': None
    }, # you cannot login as charlie/no password set
}

