---
title: "Running DIT4C"
layout: page.html
permalink: false
---

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

## DIT4C portal

### Running the portal

Running the portal in development requires that you have [Git](https://git-scm.com/) & [SBT](http://www.scala-sbt.org/) installed.

```
git clone https://github.com/dit4c/dit4c.git
cd dit4c
sbt ";project portal;~run -Dplay.crypto.secret=foobar"
```

### Portal IP address

To send messages to the DIT4C portal, other services need a hostname or IP address. In production this will likely be DNS A record pointing to a public IPv4 address. In development, because not all DIT4C services run on the same network stack (eg. compute nodes), using "localhost" (`127.0.0.1` or `::1`) won't work. It's important to instead use an IP address that's reachable by all components. Most likely this will be the gateway address of the private network you're running the compute node VM on, but it could be another address.

For future examples, we'll use `192.168.100.1`.

## DIT4C scheduler

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

Once saved, get the full PGP key fingerprints using the primary key ID:

```
$ gpg2 --with-subkey-fingerprint --list-keys 210512A677C41E86
pub   rsa4096 2017-03-03 [C] [expires: 2019-03-03]
      34546BBDED7719C865C3C4E8210512A677C41E86
uid           [ unknown] DIT4C dev scheduler (documentation example)
sub   rsa2048 2017-03-03 [A]
      6A6C97128AD8EAD1769E9B6DCD0BC076A71E68E5
sub   rsa2048 2017-03-03 [S]
      BE3950379932FF45106DF313E33DA3F435A246F9
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
$ gpg2 --armor \
  --export-secret-subkeys 6A6C97128AD8EAD1769E9B6DCD0BC076A71E68E5! \
  > dev_scheduler_secret_keyring.asc
```

Then export all the public keys:

```
$ gpg2 --armor \
  --export 34546BBDED7719C865C3C4E8210512A677C41E86 \
  > dev_scheduler_public_keyring.asc
```

#### Create scheduler in portal

When running in development, open `<ip-address>:9000` to ensure the portal app is fully loaded.

SSH to port 2222, with username `dit4c` and password as the value of `ssh.password`, or if not set, `play.crypto.secret`. In the example above, this is `foobar`.

Once you have a Scala REPL running inside the portal environment, send a message to create a new scheduler:

```
$ ssh -p 2222 dit4c@localhost
Warning: Permanently added '[localhost]:2222' (RSA) to the list of known hosts.
Password authentication
Password:
Compiling replBridge.sc
Compiling interpBridge.sc
Compiling HardcodedPredef.sc
Compiling ArgsPredef.sc
Compiling predef.sc
Compiling SharedPredef.sc
Compiling LoadedPredef.sc
Welcome to the Ammonite Repl 0.8.1
(Scala 2.11.8 Java 1.8.0_121)
@ import domain._
import domain._
@ import services._
import services._
@ app.actorSystem.eventStream.publish(
  SchedulerSharder.Envelope("34546BBDED7719C865C3C4E8210512A677C41E86",
  SchedulerAggregate.Create))

@ exit
```

When the scheduler connects & sends its PGP public keys, the portal will match them to the provided fingerprint.

#### Running the scheduler

To run the scheduler with a single cluster called "default":

```
$ sbt ";project scheduler;run
  --keys $(pwd)/dev_scheduler_secret_keyring.asc
  --keys $(pwd)/dev_scheduler_public_keyring.asc
  --portal-uri http://192.168.100.1:9000/messaging/scheduler"
```

If multiple clusters are necessary, a config file can be supplied.

`scheduler.conf`:

```
clusters = null
clusters {
  instructors {
    displayName = "Instructor Sandbox"
  }
  training {
    displayName = "Training"
    supportsSave = false
  }
}
```

```
$ sbt ";project scheduler;run
  --keys $(pwd)/dev_scheduler_secret_keyring.asc
  --keys $(pwd)/dev_scheduler_public_keyring.asc
  --portal-uri http://192.168.100.1:9000/messaging/scheduler"
  --config $(pwd)/scheduler.conf
```

## CoreOS VM

In theory, you could use any VM that has systemd and [rkt](https://coreos.com/rkt/). In practice, it's simpler to use CoreOS. In production, you're likely to use [cloud-config](https://coreos.com/os/docs/latest/cloud-config.html) or [Ignition](https://coreos.com/ignition/docs/latest/) to configure the reboot strategy, add SSH keys and mount storage, however the default config will work fine for development.

### Starting

There are many ways to run a CoreOS VM on your desktop. One way that works quite well for DIT4C development is using QEMU:
<https://coreos.com/os/docs/latest/booting-with-qemu.html>

Start the VM with a different port, as `2222/tcp` is used by the DIT4C portal:

```
./coreos_production_qemu.sh -p 2223 -nographic
```

### Installing SSH keys

You will need to deploy the SSH keys of the scheduler to the compute node. Fortunately, the DIT4C portal exposes that information via the portal.

```
$ ssh -p 2223 core@localhost
Warning: Permanently added '[localhost]:2223' (ECDSA) to the list of known hosts.
Last login: Mon Mar  6 05:09:39 UTC 2017 from 10.0.2.2 on pts/0
CoreOS alpha (1185.0.0)
core@coreos_production_qemu-1185-0-0 ~ $ curl -sL http://192.168.100.1:9000/schedulers/34546BBDED7719C865C3C4E8210512A677C41E86/ssh-keys > /tmp/keys
core@coreos_production_qemu-1185-0-0 ~ $ cat /tmp/keys
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDGst1Yze4M3mMYGkq8l+oubbbeh9zX2Iu/QBKMNAHCUM80XK0FDQuqv0g6syTiln+hXi7RcmZogygm0n71l87iLiCchKZn+BwLJbF8TowPn5D7UcscRyGQ89trqfZdvCTz+y9zObPooS0HmhHj3jTNJ1aWpeFdhkPx7CYEa2e/1/M+Q9TtV06ilCHQwWwCBND/lF0QpKPothwT8dHbvMjtt04xV70NVf7qaWGtGirTq77NciQT3vNeRDDryXaGOUtCXlOdKu/NrAUoRlgE7nwgP1lWWm04puJqeGmmwqr7BRn8j/pvmEJQ8en964hlU8Dra0o0Tj6EVgNU9QbIeZmn
core@coreos_production_qemu-1185-0-0 ~ $ update-ssh-keys -A scheduler < /tmp/keys
Adding/updating scheduler:
2048 SHA256:166+GTUeSN6zcOLrsHtBSfF0SCTC1EYLKuHOzcBXZ1g no comment (RSA)
Updated /home/core/.ssh/authorized_keys
core@coreos_production_qemu-1185-0-0 ~ $ exit
```
