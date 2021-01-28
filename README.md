

What is ODH?
===========

ODH is a decentralized, peer-to-peer open documents sharing system that leverages the ethereum blockchain
to enhance the digital self-sovereignty of its users. In addition to that it introduces a voting system for a global governance
of the system by its users.

Documents are stored (partially or entirely) by its users thanks to the IPFS protocol, a transparent and reliable 
system of distributing content. That allows people to manage, synchronize the nodes through
By leveraging the speed and redundancy of a decentralized and immutable file storage technology - IPFS (Interplanetary
File System), ODH can scale and deliver thousands of documents in a very decentralized manner.
This is achieved by storing the encrypted documents permanently on the IPFS swarm.

The set smart contracts deployed on the ODH local blockchain which collects hashes for synchronization of its peers
an votes of users. The immutability of the blockchain reduces tremendously the attack surface this data are available 
for public and its immutability can be checked by comparing hashes.

When everything is transparently stored in the ODH smart contract, we also consider introducing
additional governance mechanisms such as an ODH DAO (Decentralized Autonomous Organization)
used for voting on new features, documents deletion and other.

Due to the fast-paced emergence of blockchain technology, and high fees within the Ethereum main chain, 
the ODH system uses a private ethereum network to deploy its smart contracts, the ODH source code itself is stored on IPFS
and its hashes on the blockchain to facilitate the upgrade of the software and the way it is used to manage inner mechanics.
The main reason to use off-chain data storage based is related to the speed of data loading and data storage. 
With the progressive shift toward free transactions and proof-of-stake-like consensus algorithms, the scalability of the ODH
will certainly be improved and maybe the reliance to off-chain data storage will be irrelevant.


# Installation of ODH: installation and deployment of ODH
## Ethereum
### Ethereum Geth: go-ethereum installation
The installation of the geth client is pretty straightforward on linux machines: 
#### From source
First clone the geth ethereum from github to a directory of your choice
```bash
git clone https://github.com/ethereum/go-ethereum.git
```
*NB*: You should have a working installation of the Golang compiler before trying to compile it yourself.
Then:
```bash
cd go-ethereum
make all
sudo make install
```
### From a private repository
On Ubuntu GNU/linux, we proceed by typing the following commands on your terminal:

```bash
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

### On Arch linux
```bash
sudo pacman -S go-ethereum
```
Then write the following file under the name genesisblock.json
```javascript
{
    "config": {
        "chainID"       : 10,
        "homesteadBlock": 0,
        "eip155Block":    0,
        "eip158Block":    0
    },
    "nonce": "0x01",
    "difficulty": "0x20000",
    "mixhash": "0x00000000000000000000000000000000000000647572616c65787365646c6578",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "timestamp": "0x00",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x00",
    "gasLimit": "0x8000000",

    "alloc": {
    }
}
```


That `genesisblock.json` file will be used to create the first block of the blockchain and every node in our private network *must* 
use the same genesisblock in order to synchronize with each other and take part on the mining process.
Unlike the ethereum main chain which uses a discovery mechanism of nodes through the internet, our implementation is compelled
to use adhoc mechanism of nodes discovery. Thus the complete list of the ip address of each peers must be provider at connection.
Right now, we explore others ways of nodes discovery.
There are other requierements for the geth client is that,  every node *must have the same* _networkid_ and the --rcpport and --port *must*
be different.

The each node must run the following commands:
```bash
geth --datadir="./" init genesisblock.json
```
after the user should see something like this:
```bash
INFO [07-26|17:29:26] Maximum peer count                       ETH=25 LES=0 total=25
INFO [07-26|17:29:26] Allocated cache and file handles         database=/home/moktar/workspace/bc_stuff/s/geth/chaindata cache=16 handles=16
INFO [07-26|17:29:26] Writing custom genesis block 
INFO [07-26|17:29:26] Persisted trie from memory database      nodes=0 size=0.00B time=10.617µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [07-26|17:29:26] Successfully wrote genesis state         database=chaindata                                       hash=980536…17a77a
INFO [07-26|17:29:26] Allocated cache and file handles         database=/home/moktar/workspace/bc_stuff/s/geth/lightchaindata cache=16 handles=16
INFO [07-26|17:29:26] Writing custom genesis block 
INFO [07-26|17:29:26] Persisted trie from memory database      nodes=0 size=0.00B time=10.966µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [07-26|17:29:26] Successfully wrote genesis state         database=lightchaindata                                       hash=980536…17a77a

```
After that the user should create a new account:
```bash
geth --datadir="./" account new
```
Then launch the node with this:
```
geth --datadir="./" --networkid 23422 \
                    --rpc \
                    --rpccorsdomain="*" \
                    --rpcport="8545" \
                    --minerthreads="1" 
                    --mine \
                    --unlock 0  \
                    --rpcapi="db,eth,net,web3,personal,web3" \
                    --port 30303 console
```

After performing that on each node we should now connect them to each other according to their ip address:
On the console of each node type:
```javascript
const fs = require("fs");
const nodes_addr = fs.readFileSync("peers.txt").split()

const nodesid = admin.nodeInfo.enode.split('[::]')[0] + '@' + ipaddr
nodes_addr.map(addr => admin.addPeer)
```
example:
admin.addPeer("enode://47e61e304d802fb98403fbf877e1018d13044630a16eb9c15c1d0fb139d465e02d995acd239768f6ced04579d9639d8a75c73c30d7443a9d6d6146a44c8b5e7b@10.0.0.123:30302") 

## IPFS
### Installation of go-ipfs

The canonical to install go-ipfs is from its hosting website http://ipfs.io/docs/install/. 
However users of Arch linux, NixOS, snap supported linux distributions like Ubuntu or Debian
can install them directly from their package manager.
 * Arch Linux
In Arch Linux go-ipfs is available as
[go-ipfs](https://www.archlinux.org/packages/community/x86_64/go-ipfs/) package.
```bash
	$ sudo pacman -S go-ipfs
```
* Nix
```bash
$ nix-env -i ipfs
```
* Snap
With snap, in any of the [supported Linux distributions](https://snapcraft.io/docs/core/install):
```
  $ sudo snap install ipfs
```

For experimented users interested in building by themselves `go-ipfs`, here are the steps:
* Install the golang compiler

You'll need to add Go's bin directories to your `$PATH` environment variable e.g., 
by adding these lines to your `/etc/profile` (for a system-wide installation) or `$HOME/.profile`:

```
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$GOPATH/bin
```
Then  download and Compile IPFS.
```
$ go get -u -d github.com/ipfs/go-ipfs

$ cd $GOPATH/src/github.com/ipfs/go-ipfs
$ make install
```
### Setting up an ipfs node
To start using IPFS, the user must first initialize IPFS's config files on your system, this is done with 
`ipfs init`. See `ipfs init --help` for information on the optional arguments it takes. After initialization 
is complete, you can use `ipfs mount`, `ipfs add` and any of the other commands to explore!
<!-- # The designer Annex: How ODH is designed (diagrams and comments on them) # The testing Appendix: How to test ODH -->
# The developer Annex: Installation of the development environment
@@ Dependency graph
## Programming languages:
   * Solidity (For smart contracts)
   * EVM bytecode (For smart contracts)
   * Javascript (For the cli-client and server implementation)
## Tools used
   * GNU Emacs (A highly extensible editor from the GNU project)
   * NodeJs (Google's V8-based Javascript interpreter)
   * Npm (node package manager)
   * Git ( distributed revision control system)
   * Truffle (toolbox for the development of smart contracts)
   * Go-ipfs (A golang implementation of the IPFS protocol)
   * Geth (A golang implementation of the Ethereum protocol)
   * Web3 (Library for interacting with an ethereum client through RCP calls)
   * IPFS-API (Library for interacting with the ipfs daemon through Http request)
 
Like any *NodeJs* project, the ODH project is created with the npm (Node package manager) utility. It is essentially used 
to manage libraries and other dependencies of the project. If we take a look at dependency field of the projects configuration we see:
```javascript
"dependencies": {
    "base58": "^1.0.1",
    "chalk": "^2.4.1",
    "co": "^4.6.0",
    "co-prompt": "^1.0.0",
    "commander": "^2.15.1",
    "express": "^4.16.3",
    "ipfs-api": "^22.1.0",
    "node-pandoc": "^0.3.0",
    "progress": "^2.0.0",
    "solc": "^0.4.24",
    "truffle-contract": "^3.0.6",
    "web3": "^1.0.0-beta.34"
  }
```
The projects is hosted on Gitlab and on Npm repositories, so we have to first download it.
```bash
$ git clone https://gitlab.com/alhasapi/odh-cli.git

```
Next, install the dependencies:
```
$ cd odh-cli
$ git checkout -b dev
$ npm install
```
Now we can start to develop and hack on ODH.


# How to use ODH?
## The ODH command line
The ODH command line interface is currently the _only_ way to interacts with the network. 
The next block presents available commands on CLI interface.
```bash
  Usage: odh [options]
  odh command-line interface of managing distributed files-
  Options:

 -V, --version                     output the version number
 --add <file>                      File Inclusion to ODH
 --setup                           Setting up the network [contract compiling & deployement]
 --add-remote <link>               File Inclusion to ODH
 --from-ipfs-hash <hash>           Include files from an IPFS Hash
 --sync                            Synchronize the new node with the current state of the network
 --o-check <file>                  Check whether a file is an open document
 --owning <file>                   Registering an ownership claim
 --claim-of-ownership <hash>       Checking whether a claim of ownership is valid
 --webui                           Lauching the web user interface
 --vote-for-deletion <hash>        Vote of the deletion a file in the network.
 --deletion-req <hash>             Supply a request for the deletion of a file in the network.
 --full-node-req                   Lauching the process of becoming a full node
 --light-node-req <hash List File> Launching the hosting of a set of files
 --search <hash | name | regexp>   researching files in the network
 --stats                           Display some statistics about files in the network
 --peers                           Display the set of peer connected to the network
 --convert <hash> <file.ext>       Convert a hosted file to different format according to .ext
 --revoque-current-req             Suppend the deletion request
 --fetch <hash | name>             Write in the current directory the file hashed <hash>
 --id                              Getting the identity of the node
 --garbage-collect                 Remove unlinked or unpinned IPFS files
 --reset                           Remove configuration files
 --list-files                      List pinned files
 --author                          The author
 -h, --help                        outputs usage information
```

### Setting up the network

In order to add content to the network the user *must*, first setup the network. The setup process assume that
there is already a running instance of `go-ethereum` and `go-ipfs` daemons, if not the setup process will fail.
To launch these to daemons type:
```bash
$ geth --datadir="./" --networkid 23422  --rpc --rpccorsdomain="*" 
     --rpcport="8545" --minerthreads="1" --mine --unlock 0  
     --rpcapi="db,eth,net,web3,personal,web3" --port 30303 console&

$ ipfs daemon&
```
Next, the user can now setup the network for a new fresh use of ODH. For that the user must type:
```bash
$ odh --setup
```
The program will then outputs something like this:
```bash
[ * ] Compiling the contract
[ * ] Compilation finished
[ * ] Accounts list: 
[ '0xd7A01610F3839cCF162F1E1a3e4b6c8242EDFCD4' ]
0xd7A01610F3839cCF162F1E1a3e4b6c8242EDFCD4
624999999999000000000
```
The previous output is the process of smart contracts compilation and private ethereum account selection.
Next, the use should type the password of his ethereum account.
```bash
ethereum account password: **************
```
Then the program will deploy these sequentially the synchronization, voting, deletion, ownership contracts on
the blockchain, in with they we'll live forever.
```bash
[ * ] +> Ready to deploy SyncContract contract
[ ! ] +> Contract sucessfully deployed at:  0xfBAB107943168a7898cfC156E26Ba07131316c5A
[ * ] +> Ready to deploy the Ownership contract
[ ! ] +> Contract sucessfully deployed at:  0xddd661D1AB0edac74B2a857f9a1c77D69f6127D9
[ * ] +> Ready to deploy the Voting contract
[ ! ] +> Contract sucessfully deployed at:  0x4c2291DdbDa210731Afb540fC0c79146FD52CE87
[ * ] +> Ready to deploy the DeletionRequest contract
[ ! ] +> Contract sucessfully deployed at:  0x9580ed617A6b6E572543590bc184D0151cf79309
[ ! ] Network setup terminated finished.
```
At this level the odh system is ready to be used.

### adding files to ODH
There are three ways on add a file to the network, from the local file system, remotely and from an ipfs hash.
* From the file system
The user must type something like:
```bash
$ odh --add /path/to/file.pdf
```
* Remotely
The user must type something like:
```bash
$ odh --add-remote https://www.link.com/files/manifesto.pdf
```
##### from-ipfs-hash <hash>
   Include files from an IPFS Hash
```bash
$ odh --add-from-hash QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE
```
###  sync
   Synchronize the new node with the current state of the network
   ```bash
   $ odh --sync
   ```
###  o-check <file>
   Check whether a file is an open document
   ```bash
   $ odh --o-check path/to/file.doc
   ```
### Registering an ownership claim
To perform ownership registering the user must type:
```bash
$ odh --owning ~/Documents/Baudrillard/8.pdf
```
And it outputs:

Ownership claim registered successfully.
File hash:  QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE Date  2018-07-18T06:17:02.913Z
The user must keep the hash to prove the ownership.

###  Checking whether a claim of ownership is valid
Here the hash the choice to submit either the file or its hash.
```bash
$ odh --claim-of-ownership QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE
```

or 
```bash
$ odh --claim-of-ownership ~/Documents/Baudrillard/8.pdf 
```
and it will outputs:
```bash
SUBMITED HASH  QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE
Result {
  '0': '7799172263392990495353534020721476928909822630311254361',
  '1': '5405757533067996537833169001063788056847307298302752837',
  h: '7799172263392990495353534020721476928909822630311254361',
  h_: '5405757533067996537833169001063788056847307298302752837' }
REGISTERED HASH:  QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE
[ ! ] YOU ARE THE OWNER OF THE FILE
```

Moreover, it the submitted file have not been registered first, the program will
output:
```bash
SUBMITED HASH  QmRabQ1zTJ3Nm9pB9gvvvaLG65T1poeBfbRCG9HvJitSTW
Result {
  '0': '7799172263392990495353534020721476928909822630311254361',
  '1': '5405757533067996537833169001063788056847307298302752837',
  h: '7799172263392990495353534020721476928909822630311254361',
  h_: '5405757533067996537833169001063788056847307298302752837' }
REGISTERED HASH:  QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE
[ ! ] YOU ARE **NOT** THE OWNER OF THE FILE
```

###  Webui
  Lauching the web user interface

### Vote of the deletion a file in the network.
If there is a pending deletion request of a file on the network, 
each node can vote of its deletion by typing:
```bash
$ odh --vote-for-deletion QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE 
```
   
###  Deletion Requests 
   Supply a request for the deletion of a file in the network.
```bash
$ odh --deletion-req QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE 
```
###  Full node request
   Lauching the process of becoming a full node
```bash
$ odh --full-node-req
```
   
###  Light node request
   Launching the hosting of a set of files
```bash
$ odh --light-node-req hashlist
```

###  Verify the existence of a file
  Verifying files in the network
```bash
$ odh --exist QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE
```

###  Statistics
   Display some statistics about files in the network

```bash
$ odh --stats 
```
###  Peers
   Display the list of peer connected to the network
```bash
$ odh --peers
```
###  Converting files
   Convert a hosted file to different format according to .ext
```bash
$ odh --convert QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE out.pdf
```
   
### Revoke the deletion request
It suspends the deletion request, reversed only to the one who have submitted the deletion request.
```bash
$ odh --revoke-req QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE

```
###  Fetch files
   Write in the current directory the file hashed <hash>

```bash
$ odh --fetch QmZ6vPS45mVqLMh4NNemPYY8pQf37AwkBeTooemDRSLNxE

```
###  Node id
   Getting the identity of the node
```bash

$ odh --id
``` 
   
###  Garbage collection
   Remove unlinked or unpinned IPFS files
```bash

$ odh --gc
``` 
   
###  reset
   Remove configuration files
```bash

$ odh --reset
``` 
   
### List of files
   List pinned files
```bash

$ odh --list-files
``` 
   

# Future work

In a near future, we've planned to:
- Re-implement ODH in Haskell
- Switch to proof-of-stake based blockchains like (EOS or Tezos)
- Implement of a peer finding algorithm for auto-connection to peers on top of the IPFS SWARM protocol.
- A formalization in Coq of all algorithms involved (peers finding, voting, synchronization) and use 
  program extraction methods to derive the program from the proofs.
- Implement a better Web UI, to make  ODH user friendly and accessible for non technical people.
- Decoupling components of ODH in order to make components of ODH reusable for other purpose (video sharing, NLP)



