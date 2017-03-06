# In Development

To run a minimal DIT4C environment in development, you need to run the following:

* Apache Cassandra
* DIT4C portal
* a DIT4C scheduler
* a CoreOS VM to serve as a compute node
* a DIT4C image server (optional)

When running in production, you are will also need to run a DIT4C routing server. By using a helper that utilizes [ngrok](https://ngrok.com/) we can avoid this requirement in development.

## Apache Cassandra

A database is required for both the portal and scheduler. Ensure Cassandra is available somehow on `localhost:9042`. By default, no authentication is expected.

From tarball or Debian package:
<http://cassandra.apache.org/doc/latest/getting_started/installing.html>

Docker image:
<https://hub.docker.com/r/_/cassandra/>

## DIT4C Scheduler

### Scheduler keys

DIT4C schedulers use PGP keys for identification, configuration and SSH authentication to compute nodes. You will need to create a PGP primary key for each scheduler. We'll use `gpg2`.

#### Key Creation

First, we create a PGP primary key on a separate secure machine, solely for certification:
```
$ gpg2 --full-gen-key --expert
gpg (GnuPG) 2.1.13; Copyright (C) 2016 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
   (9) ECC and ECC
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
Your selection? 8

Possible actions for a RSA key: Sign Certify Encrypt Authenticate
Current allowed actions: Sign Certify Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? s

Possible actions for a RSA key: Sign Certify Encrypt Authenticate
Current allowed actions: Certify Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? e

Possible actions for a RSA key: Sign Certify Encrypt Authenticate
Current allowed actions: Certify

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? q
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 2y
Key expires at Sun 03 Mar 2019 12:45:01 AEST
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: DIT4C dev scheduler
Email address:
Comment: documentation example
You selected this USER-ID:
    "DIT4C dev scheduler (documentation example)"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? o
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
gpg: key 210512A677C41E86 marked as ultimately trusted
gpg: revocation certificate stored as '/home/uqtdettr/.gnupg/openpgp-revocs.d/34546BBDED7719C865C3C4E8210512A677C41E86.rev'
public and secret key created and signed.

gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   9  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 9u
gpg: next trustdb check due at 2018-01-20
pub   rsa4096 2017-03-03 [] [expires: 2019-03-03]
      34546BBDED7719C865C3C4E8210512A677C41E86
uid           [ultimate] DIT4C dev scheduler (documentation example)

```

We then add two sub-keys for signing and authentication, choosing not to set password protection when prompted:

```
$ gpg2 --expert --edit-key 34546BBDED7719C865C3C4E8210512A677C41E86
gpg (GnuPG) 2.1.13; Copyright (C) 2016 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa4096/210512A677C41E86
     created: 2017-03-03  expires: 2019-03-03  usage: C
     trust: ultimate      validity: ultimate
[ultimate] (1). DIT4C dev scheduler (documentation example)

gpg> addkey
Please select what kind of key you want:
   (3) DSA (sign only)
   (4) RSA (sign only)
   (5) Elgamal (encrypt only)
   (6) RSA (encrypt only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
  (12) ECC (encrypt only)
  (13) Existing key
Your selection? 8

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Sign Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? s

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? e

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions:

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? a

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Authenticate

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? q
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048)
Requested keysize is 2048 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0)
Key does not expire at all
Is this correct? (y/N) y
Really create? (y/N) y
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

sec  rsa4096/210512A677C41E86
     created: 2017-03-03  expires: 2019-03-03  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa2048/CD0BC076A71E68E5
     created: 2017-03-03  expires: never       usage: A
[ultimate] (1). DIT4C dev scheduler (documentation example)

gpg> addkey
Please select what kind of key you want:
   (3) DSA (sign only)
   (4) RSA (sign only)
   (5) Elgamal (encrypt only)
   (6) RSA (encrypt only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
  (12) ECC (encrypt only)
  (13) Existing key
Your selection? 4
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048)
Requested keysize is 2048 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0)
Key does not expire at all
Is this correct? (y/N) y
Really create? (y/N) y
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

sec  rsa4096/210512A677C41E86
     created: 2017-03-03  expires: 2019-03-03  usage: C
     trust: ultimate      validity: ultimate
ssb  rsa2048/CD0BC076A71E68E5
     created: 2017-03-03  expires: never       usage: A
ssb  rsa2048/E33DA3F435A246F9
     created: 2017-03-03  expires: never       usage: S
[ultimate] (1). DIT4C dev scheduler (documentation example)

gpg> save
```

Future examples will use the key IDs above.

#### Key usage explanation

We now have a primary key and two sub-keys. While in development, key security isn't as important, however it's worthwhile thinking about how key security will operate in production.

The **primary key** should be stored securely, preferably offline when not in use for key rotation or renewal. It's entirely possible it will only be used (every two years in this case) to update the PGP key expiry date.

The **authentication sub-key** is used by the scheduler to identify itself to the portal, and is also transformed into the SSH key that is used to log into compute nodes. Both the public and secret key will need to be exported for use on the scheduler.

The **signing sub-key** is only used for sending messages to the scheduler. Only the public component needs to be on the scheduler. The secret key should be stored securely, and may be transferred to a smart card or other hardware device if desired.

#### Key export

Export just the authentication secret sub-key:

```
gpg2 --armor \
  --export-secret-subkeys CD0BC076A71E68E5! \
  > dev_scheduler_secret_keyring.asc
```

Then export all the public keys:

```
gpg2 --armor \
  --export 210512A677C41E86 \
  > dev_scheduler_public_keyring.asc
```




## CoreOS VM

In theory, you could use any VM that has systemd and [rkt](https://coreos.com/rkt/). In practice, it's simpler to use CoreOS. In production, you're likely to use [cloud-config](https://coreos.com/os/docs/latest/cloud-config.html) or [Ignition](https://coreos.com/ignition/docs/latest/) to configure the reboot strategy, add SSH keys and mount storage, however the default config will work fine for development.

There are many ways to run a CoreOS VM on your desktop. One way that works quite well for DIT4C development is using QEMU:
<https://coreos.com/os/docs/latest/booting-with-qemu.html>

Start the VM with a different port, as `2222/tcp` is used by the DIT4C portal:

```
./coreos_production_qemu.sh -p 2223 -nographic
```
