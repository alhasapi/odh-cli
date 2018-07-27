#!/usr/bin/env node


const program = require("commander");
//const contractFIle = "contracts/SimpleStorage.json"
//const contractAddress = "0x14a0a8f85f7041c1bed7a372479821f0caf09b63";
//var contractJsonInterface = JSON.parse(fs.readFileSync(contractFIle).toString());
//var contract = new web3.eth.Contract(contractJsonInterface, contractAddress);
let cost = 10000000000000000000000000;
let gas = 1000000;
let configFileName = "./.conf.json"
let hashesBase = "./.HashBases.json"
let owners = "./.owners.txt"

let SUPPORTED_FORMATS = [
    '.docx',
    '.txt',
    '.doc',
    '.md',
    '.html',
    '.xml',
    '.org',
    ''
]

var source;
var compiled;
var bin;
var abi;
var contract;
var bin2;
var abi2;
var contract2;
var bin3;
var abi3;
var contract3;
var bin4;
var abi4;
var contract4;
var address, address2, address3, address4;
var account;

program
    .version("1.0")
    .description("odh command-line interface of managing distributed files-")
    .option('--add <file>', "File Inclusion to ODH")
    .option('--setup', "Setting up the network [contract compiling & deployement]")
    .option('--add-remote <link>', "File Inclusion to ODH")
    .option('--from-ipfs-hash <hash>', 'Include files from an IPFS Hash')
    .option('--sync', 'Synchronize the new node with the current state of the network')
    .option('--o-check <file>', 'Check wether a file is an open document')
    .option('--owning <file>', 'Registering an ownership claim')
    .option('--claim-of-ownership <hash>', 'Checking wether a claim of ownership is valid')
    .option('--webui', 'Lauching the web user interface')
    .option('--vote-for-deletion <hash>', 'Supply a request for the deletion of a file in the network.')
    .option('--full-node-req', 'Lauching the process of becoming a full node')
    .option('--light-node-req <hash List File>', 'Launching the hosting of a set of files')
    .option('--search <hash | name | regexp>', "researching files in the network")
    .option('--stats', "Display some statistics about files in the network")
    .option('--peers', "Display the set of peer connected to the network")
    .option('--convert <hash> <file.ext>', "Convert a hosted file to different format according to .ext")
    .option('--fetch <hash | name>', "Write in the current directory the file hashed <hash>")
    .option('--id', "Getting the identity of the node")
    .option('--garbage-collect', "Remove unlinked or unpinned IPFS files")
    .option('--list-files', 'List pinned files')
    .option('--author', 'The author')
    .parse(process.argv)

const Web3 = require("web3");
const IPFS = require('ipfs-api');
const co = require("co");
const prompt = require("co-prompt");
const chalk = require("chalk")
const fs = require("fs");

const ipfs = new IPFS({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
});
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(provider);
const bs58 = require("base58")

function getBytes32FromIpfsHash(ipfsListing) {
    var v = "0x" + bs58.decode(ipfsListing)
    return v.slice(2).toString('hex')
}

function getIpfsHashFromBytes32(bytes32Hex) {
    const hashHex = "1220" + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
}

const bnto2uint = (bn) => {
    //0,k; k,k*2; k*2,k*3; k*3, bn.length
    var k = 23;
    gn = bn.toBuffer()
    gn1 = gn.slice(0, k).toString()
    gn2 = gn.slice(k, k * 2).toString()
    return [ipfsHashtoBN(gn1), ipfsHashtoBN(gn2)]
}
const ipfsHashtoBN = (hash) => {
    return web3.utils.toBN(web3.utils.toHex(hash))
}

const fromBNtoIpfs = (bn) => {
    return bn.toBuffer().toString()
}


const lightNodeReq = () => {
    console.log("Light Node Sync:")
    const fileHashName = program.lightNodeReq;
    const hashes = fs.readFileSync(fileHashName).split("\n");

    for (var i in hashes) {
        ipfs.get(hashes[i]).then(inf => {
            const out = inf[0].hash;
            console.log("file %s added successfully", out)
        })
    }

}

const extractType = (hash) => {
    let type;
    ipfs.get(hash).then(inf => {
        let content = inf[0].content;
        // some format detection stuff here.
    })
    return type;
}

const convertFile = (hash, to) => {
    var nodePandoc = require('node-pandoc');
    var src, args, callback;

    // if the file is supported and destination formart are supported then
    // extract file type
    extractType(hash);
    src = './word.docx';

    // Or in an array of strings -- careful no spaces are present:
    args = ['-f', 'docx', '-t', 'markdown', '-o', 'markdown.md'];

    // Set your callback function
    const execute_if_error = (err, result) => {
        if (err) {
            console.error('An error occured: ', err);
        }
        // For output to files, the 'result' will be a boolean 'true'.
        // Otherwise, the converted value will be returned.
        console.log(result);
        return result;
    };

    // Call pandoc
    nodePandoc(src, args, callback);
}

fromIpfsHash = () => {
    hash = program.fromIpfsHash;
    ipfs.get(hash).then(retObj => {
        console.log("File Added successfully")
        var hash = retObj[0]["hash"];
        var bn = ipfsHashtoBN(hash)
        var bn_ = bnto2uint(bn)
        var bn1 = bn_[0]
        var bn2 = bn_[1]
        console.log(chalk.bold.green("adding " + hash + " to ODH."))
        addHashToHashBase(hash)
        ipfs.add(fs.readFileSync(hashesBase)).then(retObj => {
            var hash2 = retObj[0]["hash"];
            var bn = ipfsHashtoBN(hash2)
            var bn_ = bnto2uint(bn)
            var bn1 = bn_[0]
            var bn2 = bn_[1]
            return contract.methods.set(bn1, bn2).send({
                from: account,
                value: cost
            })
        })
    })
}

const deletionRequest = (hash) => {
    var config = loadConfig();
    bin = config.code4;
    abi = config.abi4;
    account = config.account;
    contract = new web3.eth.Contract(abi);
    contract.options.address = config.address4;
    web3.eth.getAccounts().then(accounts => {
        contract.methods.isPending().call().then(value => {
            if (value["res"])
                contract.methods.setHash(hash)
                .send({
                    from: account,
                    value: cost
                })
                .on('receipt', inf => {
                    console.log(inf)
                })
            else {
                console.log(chalk.bold.red('[ ! ]'), "You cannot submit a deletion request, there is already on in process.");
            }
        })
    })
}


const votingForDeletion = () => {
    const config = loadConfig();

    account = config.account;

    const deletionReqContract = new web3.eth.Contract(config.abi4);
    contract.options.address = config.address4;

    const votingContract = new web3.eth.Contract(config.abi3);
    votingContract.options.address = config.address3;
    // stop if the request is not pending

    // extract deletion hash from the blockchain
    //const deletionHash;

    console.log("Do you really want to remove the file from the network? ")
    console.log("You still inspect the file before voting")
    console.log("File Hash: ", chalk.bold.green(deletionHash))
    co(function*() {
        const vote = prompt("Your choice [Yes or No]: ");
        do {
            console.log("Please answer yes or no")
        } while (vote.toLowerCase() != "yes" || vote.toLowerCase() != "no");
        const choice = vote.toLowerCase() == "yes";
        if (choice) {
            console.log("You choose to delete the file")
            votingContract.methods.vote(choice);
        } else {
            console.log("You choose to  keep the file")
            votingContract.methods.vote(choice);
        }
        console.log("Done!")

    })
}

const setup = () => {
    if (fs.existsSync(configFileName)) {
        var content = fs.readFileSync(configFileName);
        if (content.toString()) {
            console.log("Contracts already deployed");
            console.log("Remove .conf.json if yout want to restart the deployement");
        }
        return;
    }
    const solc = require('solc');
    console.log(chalk.bold.yellow('[ * ]'), "Compiling the contract");
    source = fs.readFileSync('./contracts/SimpleStorage.sol', 'UTF-8');
    compiled = solc.compile(source);
    bin = compiled.contracts[':SyncContract'].bytecode;
    contracts = compiled.contracts;
    abi = JSON.parse(compiled.contracts[':SyncContract'].interface);
    contract = new web3.eth.Contract(abi);

    bin2 = compiled.contracts[':Ownership'].bytecode;
    abi2 = JSON.parse(compiled.contracts[':Ownership'].interface);
    contract2 = new web3.eth.Contract(abi2);

    bin3 = compiled.contracts[':Voting'].bytecode;
    abi3 = JSON.parse(compiled.contracts[':Voting'].interface);
    contract3 = new web3.eth.Contract(abi3);

    bin4 = compiled.contracts[':DeletionRequest'].bytecode;
    abi4 = JSON.parse(compiled.contracts[':DeletionRequest'].interface);
    contract4 = new web3.eth.Contract(abi4);

    console.log(chalk.bold.yellow('[ * ]'), "Compilation finished");

    web3.eth.getAccounts().then(accounts => {
        console.log(chalk.bold.blue('[ * ]'), 'Accounts list: ');
        console.log(accounts)
        web3.eth.coinbase = accounts[0];
        account = accounts[0];
        console.log(account)
        return web3.eth.getBalance(account);
    }).then(balance => {
        console.log(balance)
        co(function*() {
            var password = yield prompt.password("ethereum account password: ")
            web3.eth.personal.unlockAccount(account, password)
                .then(result => {
                    console.log(chalk.bold.blue('[ * ]'), '+> Ready to deploy SyncContract contract');
                    contract.deploy({
                            data: '0x' + bin,
                            arguments: []
                        })
                        .send({
                            from: account,
                            gas: gas
                        })
                        .on('receipt', receipt => {
                            console.log(chalk.bold.yellow('[ ! ]'), "+> Contract sucessfully deployed at: ", chalk.bold.green(`${receipt.contractAddress}`));
                            address = receipt.contractAddress;
                            web3.eth.personal.unlockAccount(account, password)
                                .then(result => {
                                    console.log(chalk.bold.blue('[ * ]'), '+> Ready to deploy the Ownership contract');
                                    contract2.deploy({
                                            data: '0x' + bin2,
                                            arguments: []
                                        })
                                        .send({
                                            from: account,
                                            gas: gas
                                        })
                                        .on('receipt', receipt => {
                                            console.log(chalk.bold.yellow('[ ! ]'), "+> Contract sucessfully deployed at: ", chalk.bold.green(`${receipt.contractAddress}`));
                                            address2 = receipt.contractAddress;
                                            web3.eth.personal.unlockAccount(account, password)
                                                .then(result => {
                                                    console.log(chalk.bold.blue('[ * ]'), '+> Ready to deploy the Voting contract');
                                                    contract3.deploy({
                                                            data: '0x' + bin3,
                                                            arguments: []
                                                        })
                                                        .send({
                                                            from: account,
                                                            gas: gas
                                                        })
                                                        .on('receipt', receipt => {
                                                            console.log(chalk.bold.yellow('[ ! ]'), "+> Contract sucessfully deployed at: ", chalk.bold.green(`${receipt.contractAddress}`));
                                                            address3 = receipt.contractAddress;
                                                            web3.eth.personal.unlockAccount(account, password)
                                                                .then(result => {
                                                                    console.log(chalk.bold.blue('[ * ]'), '+> Ready to deploy the DeletionRequest contract');
                                                                    contract4.deploy({
                                                                            data: '0x' + bin4,
                                                                            arguments: []
                                                                        })
                                                                        .send({
                                                                            from: account,
                                                                            gas: gas
                                                                        })
                                                                        .on('receipt', receipt => {
                                                                            console.log(chalk.bold.yellow('[ ! ]'), "+> Contract sucessfully deployed at: ", chalk.bold.green(`${receipt.contractAddress}`));
                                                                            configOptions = {
                                                                                code: bin,
                                                                                abi: abi,
                                                                                address: address,

                                                                                code2: bin2,
                                                                                abi2: abi2,
                                                                                address2: address2,

                                                                                code3: bin3,
                                                                                abi3: abi3,
                                                                                address3: address3,

                                                                                code4: bin4,
                                                                                abi4: abi4,
                                                                                address4: receipt.contractAddress,

                                                                                account: account,
                                                                            }
                                                                            var conf = fs.openSync(configFileName, "w");
                                                                            fs.writeFileSync(conf, JSON.stringify(configOptions));
                                                                            fs.closeSync(conf);
                                                                            console.log(chalk.bold.yellow('[ ! ]'), "Network setup terminated finished.");
                                                                        });
                                                                }, error => {
                                                                    console.log(chalk.bold.red('[ ? ]'), `***** contractApi - account unlock error - ${error}`);
                                                                });
                                                        });
                                                }, error => {
                                                    console.log(chalk.bold.red('[ ? ]'), `***** contractApi - account unlock error - ${error}`);
                                                });
                                        })
                                });
                        }, error => {
                            console.log(chalk.bold.red('[ ? ]'), `***** contractApi - account unlock error - ${error}`);
                        });
                });
        }, error => {
            console.log(chalk.bold.red('[ ? ]'), `***** contractApi - account unlock error - ${error}`);
        });


    })
}

loadConfig = () => JSON.parse(fs.readFileSync(configFileName));

/*
    This ownership stuff is the source of many lawsuite cases in the scientific
    reasearch realm. It's even an issue for publishing and authorship related activities
    like books publishers and so on.

    But what if an idea with all of its mutations aretracked in a kinda zero-knowledge way.
    An individual will be able to proof under certain assumptions that he is the author of
    of sequences of bytes through this breakthrough way of managing distributed data base through
    timestamp-based and proof-of-{work, stake} consensus mechanism.

    The set of assumption used to achieve such a thing is pretty narrow, they are namely:
        - The data submited to the networks are inserted into block and chained together with
          the hash of the previous block execept of course the first block (genesis node); in
          that case the rule is that to be considered as the member of the network you *must*
          use the same genesis block with other nodes of the network.
        - When a block is chained with others it's impossible to change it without changing 
          the hash of that block and the hash of the merkle root.
        - blocks are timestamped so if a block is chained at a certain time it is a proof that,
          it hash been the data inside it had been inserted at that time prior to the argument
          that the blockchain is immutable.
    Therefore we simply need to insert the file itself but this solution is useless 
    because the hash of the file is sufficient for our proof and also that hashes are fit
    perfectly with our zero-knowledge context. We will also need to insert the hash of certain
    informations about the author like (name, birthday, city, research field)
*/

const ownershipRegistering = () => {
    var config = loadConfig();
    bin = config.code2;
    abi = config.abi2;
    account = config.account;
    contract = new web3.eth.Contract(abi);
    contract.options.address = config.address2;

    try {
        const fileName = program.owning;
        const buffer = fs.readFileSync(fileName);

        // co(function *() {
        //     var name = yield prompt("Your Name: ")
        //     var birthday = yield prompt("birthday: ")
        ipfs.add(buffer).then(retObj => {
            var hash = retObj[0]["hash"];
            var bn = ipfsHashtoBN(hash)
            var bn_ = bnto2uint(bn)
            console.log(gn_)
            var bn1 = (bn_[0])
            var bn2 = (bn_[1])
            ipfs.pin.add(hash).then(inf => {
                console.log(hash)
                contract.methods.setOwnership(Buffer.from(hash.toString()).toString())
                    .send({
                        from: account,
                        value: cost
                    })
                    .on('receipt', arg => {
                        console.log(arg)
                        console.log("Ownership claim registered successfully.")
                        console.log("File hash: ", inf[0].hash, "Date ", new Date())
                        return;
                    });
                return;
            }).catch(err => {
                console.log(err)
                console.log("Unable to register the file")
                return;
            })
        }).catch(err => {
            console.log("The ipfs daemon in not running");
            return;
        })
        //   });
    } catch (error) {
        console.log(chalk.bold.red("[ ! ]"), "Unable to open the " + program.owning);
    }
}

/*
    To check an ownership we will need all the data previously inserted 
    (in the ownership registering function), extracting them and then 
    comparing them. 
    Later we will make the probalistic nature of the proof less elusive.
    The probalistic nature

*/

const fetch = () => {
    ipfs.get(program.fetch).then(inf => {
        var buffer = inf[0].content;
        console.log(buffer)
        console.log("Writing ", program.fetch, "to the current directory...");

        var file = fs.openSync(program.fetch, "w");
        fs.writeFileSync(file, buffer);
        console.log("done..")

    })
}

const lauchWebui = () => {
    const express = require('express')
    const app = express()
    app.use(express.static(__dirname + '/webui/'));

    app.get('/', (req, res) => res.render('index.html'))
    app.listen(3000, () => console.log('Server listening on port 3000!'))
}

const ownershipClaim = (fileName) => {
    var config = loadConfig();
    bin = config.code2;
    abi = config.abi2;
    account = config.account;
    contract = new web3.eth.Contract(abi);
    contract.options.address = config.address2;

    const buffer = fs.readFileSync(fileName);
    ipfs.add(buffer).then(retObj => {
        var submitedHash = retObj[0]["hash"];
        console.log("SUBMITED HASH ", submitedHash)
        contract.methods.getOwnersList().call().then(t => {
            console.log(t);
            var fst = web3.utils.toBN(t["h"]);
            var snd = web3.utils.toBN(t["h_"]);

            var registeredHash = fromBNtoIpfs(fst) + fromBNtoIpfs(snd);
            console.log("REGISTERED HASH: ", registeredHash)
            if (submitedHash == registeredHash) {
                console.log(chalk.bold.green("[ ! ] YOU ARE THE OWNER OF THE FILE"))
            } else {
                console.log(chalk.bold.red("[ ! ] YOU ARE **NOT** THE OWNER OF THE FILE"))
            }
        })
    })

}




loadHashesBase = () => {
    if (!fs.existsSync(hashesBase)) {
        return ''
    }
    return fs.readFileSync(hashesBase).toString().split('\n')
}

addHashToHashBase = (hash) => {
    hashes = loadHashesBase();
    if (!hashes)
        hashes = []
    hashes.push(hash);
    var theFile = fs.openSync(hashesBase, "w");
    fs.writeFileSync(theFile, hashes.join("\n"))
    fs.closeSync(theFile)
}

removeHashFromHashBase = (hash) => {
    hashes = loadHashesBase();
    hashes.remove(hash);
    var theFile = fs.openSync(hashesBase, "w");
    fs.writeFileSync(theFile, hashes.join("\n"))
    fs.closeSync(theFile)
}
/*
    The synchronization algorithm is pretty straightforward.
    The sync multihash is stored in the ODH blockchain and managed by a smart contract. 

    The algorithm starts by extracting that hash from the blockchain.
    Perform the ipfs-get operation from that hash then extract a set of new hashes:
    then map ipfs-get to all of them.
*/

syncWithPeers = () => {
    var config = loadConfig();
    bin = config.code;
    abi = config.abi;
    account = config.account;
    contract = new web3.eth.Contract(abi);
    contract.options.address = config.address;
    console.log("Synchronization with peers is starting:")

    web3.eth.getAccounts().then(accounts => {
        contract.methods.get().call().then(t => {
            var fst = web3.utils.toBN(t["0"]);
            var snd = web3.utils.toBN(t["1"]);
            var hash = fromBNtoIpfs(fst) + fromBNtoIpfs(snd);
            console.log(hash)
            ipfs.get(hash).then((obj) => {
                hashes = obj[0].content.toString().split('\n');
                for (var j in hashes) {
                    ipfs.get(hashes[j]).then(z => {
                        var s = z[0].path;
                        console.log(chalk.bold.blue("[ ! ]"), s, "downloaded successfully.")
                    })
                }
            })
        });
    })
}


fileInsertion = () => {
    console.log("Before the file insertion, we need first to Synchronize with peers")
    showPeers()
    //syncWithPeers()
    var config = loadConfig();
    bin = config.code;
    abi = config.abi;
    account = config.account;
    contract = new web3.eth.Contract(abi);
    contract.options.address = config.address;
    const isLink = program.add.match(/^http|^ftp/)
    console.log("adding ", program.add);
    const buffer = fs.readFileSync(program.add);
    ipfs.add(buffer).then(retObj => {
        var hash = retObj[0]["hash"];
        var bn = ipfsHashtoBN(hash)
        var bn_ = bnto2uint(bn)
        var bn1 = bn_[0]
        var bn2 = bn_[1]
        console.log(bn1, bn2)
        //   h1 = hash.slice(0, hash.length/2)
        //   h2 = hash.slice(hash.length/2, hash.length)
        console.log(chalk.bold.green("adding " + hash + " to ODH."))
        //   h1_x = web3.utils.fromAscii(h1)
        //   h2_x = web3.utils.fromAscii(h2)
        //   console.log("h1 = (%s, %s) et h2 = (%s, %s)", h1_x, web3.utils.toUtf8(h1_x), h2_x, web3.utils.toUtf8(h2_x))
        //   contract.methods.set(h1_x, h2_x).call({from:account});
        addHashToHashBase(hash)
        ipfs.add(fs.readFileSync(hashesBase)).then(retObj => {
            var hash2 = retObj[0]["hash"];
            var bn = ipfsHashtoBN(hash2)
            var bn_ = bnto2uint(bn)
            var bn1 = bn_[0]
            var bn2 = bn_[1]
            return contract.methods.set(web3.utils.toBN(bn1), bn2).send({
                from: account,
                value: cost
            }).catch(err => {
                console.log(err)
            })
        })
    }).catch(err => {
        console.log(chalk.bold.red("[ ? ]"), " File insertion failed");
        console.log(chalk.bold.red("[ ? ]"), " The IPFS daemon is not running");
        console.log(err);

    });

}


listFiles = () => {
    console.log(loadHashesBase())
}

remoteAddFromLink = () => {
    var link = program.addRemote;
    ipfs.util.addFromURL(link).then(v => {
        var hash = v[0].hash
        var bn = ipfsHashtoBN(hash)
        var bn_ = bnto2uint(bn)
        var bn1 = bn_[0]
        var bn2 = bn_[1]
        //   h1 = hash.slice(0, hash.length/2)
        //   h2 = hash.slice(hash.length/2, hash.length)
        console.log(chalk.bold.green("adding " + hash + " to ODH."))
        //   h1_x = web3.utils.fromAscii(h1)
        //   h2_x = web3.utils.fromAscii(h2)
        //   console.log("h1 = (%s, %s) et h2 = (%s, %s)", h1_x, web3.utils.toUtf8(h1_x), h2_x, web3.utils.toUtf8(h2_x))
        //   contract.methods.set(h1_x, h2_x).call({from:account});
        addHashToHashBase(hash)
        ipfs.add(fs.readFileSync(hashesBase)).then(retObj => {
            var hash2 = retObj[0]["hash"];
            var bn = ipfsHashtoBN(hash2)
            var bn_ = bnto2uint(bn)
            var bn1 = bn_[0]
            var bn2 = bn_[1]
            return contract.methods.set(bn1, bn2).send({
                from: account,
                value: cost
            })
            console.log(chalk.bold.blue('[ ! ] ', link, "Added successfully: ", hash))
        });
    })
}


const showPeers = () => {
    ipfs.swarm.peers().then(peersList => {
        for (var j in peersList) {
            console.log(chalk.bold.yellow(peersList[j].addr.toString()))
        }
    }).catch(err => {
        console.log(chalk.bold.red('[ ! ]'), "The IPFS daemon is not running");
    })
}


if (program.listFiles) {
    listFiles()
    // ipfs.pin.ls().then(files => {
    //     for(var idx in files) {
    //         //console.log(files[idx]["hash"])
    //     }
    // });
}


if (program.add) {
    fileInsertion();
}
if (program.fromIpfsHash) {
    fileInsertion();
}

if (program.setup) {
    setup();
}

if (program.sync) {
    syncWithPeers()
}

if (program.fromIpfsHash) {
    fromIpfsHash();
}

if (program.peers) {
    showPeers()
}

if (program.id) {
    console.log(chalk.bold.blue('[ ! ]'), "USER INFORMATIONS")
    ipfs.id().then(inf => {
        console.log("USER ID:", inf.id)
        console.log("Protocol Version:", inf.protocolVersion)
        console.log("Public key: ", inf.publicKey, "\n")
        console.log("Addresses Attached to ", inf.id, "\n")
        for (var k in inf.addresses)
            console.log(inf.addresses[k])
    })
}

if (program.fetch) {
    fetch()
}

if (program.author) {
    console.log("(c) MOKTAR ALHASAPI BAVA <moktaralhasapi@gmail.com>")
}

if (program.webui) {
    lauchWebui()
}

if (program.owning) {
    ownershipRegistering()
}

if (program.claimOfOwnership) {
    ownershipClaim(program.claimOfOwnership);
}