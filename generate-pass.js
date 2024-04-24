const { request, response } = require("express");
const { PKPass } = require("passkit-generator");
require('dotenv').config();

// Now you can access the environment variables
const passTypeIdentifier = process.env.PASS_TYPE_IDENTIFIER;
const webServiceURL = process.env.WEB_SERVICE_URL;
const teamIdentifier = process.env.TEAM_IDENTIFIER;
var fs = require('file-system');
var axios = require('axios');


try {
    const wwdrCert = fs.readFileSync("./credential/AppleWWDR.pem");
    const signerCert = fs.readFileSync("./credential/pass.pem");
    const signerKey = fs.readFileSync("./credential/signing.key");
    
    // Create PKPass
    PKPass.from({
        model: "./custom.pass",
        certificates: {
            wwdr: wwdrCert,
            signerCert: signerCert,
            signerKey: signerKey,
        }
    }, {
        passTypeIdentifier: passTypeIdentifier,
        webServiceURL : webServiceURL,
        authenticationToken : "vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc",
        description: "E-Ticket Sheila On 7 Concert",
        teamIdentifier : teamIdentifier,
        logoText: "(DEMO) Sheila On 7 Concert",
        serialNumber: "PASS-213213"
    })
    .then(async (newPass) => {
        newPass.primaryFields.push(
            {
                key : "primary",
                label : "NAME",
                value: "Resa Dwiantoro"
            }
        )
        newPass.secondaryFields.push(
            {
                key: "category",
                label: "CATEGORY",
                value: "2A"
            },
            {
                key: "gate",
                label: "GATE",
                value: "EAST GATE",
                textAlignment: "PKTextAlignmentRight"
            }
        )

        newPass.auxiliaryFields.push(
            {
                key: "opengate",
                label: "OPEN GATE",
                value: "19 July 2024, 16:00"
            },
            {
                key: "closegate",
                label: "CLOSE GATE",
                value: "19 July 2024, 19:00",
                textAlignment: "PKTextAlignmentRight"
            }
        )

        newPass.backFields.push(
            {
                key : "primarydetail",
                label : "NAME",
                value: "Resa Dwiantoro"
            },
            {
                key: "categorydetail",
                label: "CATEGORY",
                value: "2A"
            },
            {
                key: "gatedetail",
                label: "GATE",
                value: "EAST GATE",
                textAlignment: "PKTextAlignmentRight"
            },
            {
                key: "opengatedetial",
                label: "OPEN GATE",
                value: "19 July 2024, 16:00"
            },
            {
                key: "closegatedetail",
                label: "CLOSE GATE",
                value: "19 July 2024, 19:00",
            },
            {
                label: "INVOICE NUMBER",
                key: "invoiceNumber",
                value: "INV-12983017200"
            },
            {
                label: "DATE BOOKED",
                key: "datebooked",
                value: "1 May 2024"
            },
        )

        // [YOU CAN CHANGES THE LOGO, TUMBNAIL, ICON DYNAMICALLY USING THIS CODE]

        // const resp = await axios.get("https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg", { responseType: 'arraybuffer' });
        // const buffer = Buffer.from(resp.data, 'utf-8');
        // newPass.addBuffer('logo.png', buffer);
        // newPass.addBuffer('logo@2x.png', buffer);

        // newPass.addBuffer('icon.png', buffer);
        // newPass.addBuffer('icon@2x.png', buffer);

        // [YOU CAN SET YOUR BARCODE VALUE HERE, OR CAN CHANGES THE TYPE. HERES THE REFERENCES]
        // https://developer.apple.com/documentation/walletpasses/pass/barcodes
        newPass.setBarcodes("DEMO ONLY")
        const bufferData = newPass.getAsBuffer();
        fs.writeFileSync("new.pkpass", bufferData);
        console.log('Pass generated successfully!');
    }).catch(error => {
        console.error('Error generating pass:', error);
    });
} catch (error) {
    console.error('Error reading certificate files:', error);
}
