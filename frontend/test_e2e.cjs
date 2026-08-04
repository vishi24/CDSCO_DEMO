const axios = require('axios');

async function testE2E() {
  try {
    console.log('Testing Registration Flow...');
    console.log('Skipping Registration Flow...');
    /*
    const registerResponse = await axios.post('http://localhost:3000/api/v1/organizations/register', {
      orgType: 'MANUFACTURER',
      orgName: 'Pharma Corp',
      cinLlpin: 'U12345MH2024PTC123456',
      panNumber: 'ABCDE1234F',
      gstNumber: '27ABCDE1234F1Z5',
      city: 'Mumbai',
      stateCode: 'MH',
      contactPersonName: 'John Doe',
      contactPersonDesignation: 'Director',
      aadhaarToken: '123456789012',
      mobile: '9999999999',
      email: 'pharma@example.com'
    });
    console.log('Registration Success:', registerResponse.data);
    */

    console.log('Testing Login Flow for industry_user...');
    const loginResponse = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: 'industry@example.com',
      password: 'password'
    });
    console.log('Login Success:', loginResponse.data);
    const token = loginResponse.data.access_token;

    console.log('Testing Drug Application Submission...');
    const appResponse = await axios.post('http://localhost:3000/api/v1/applications', {
        caseType: 'NEW_LICENCE',
        genericName: 'Paracetamol',
        brandName: 'Crocin',
        drugCategory: 'ALLOPATHIC',
        dosageForm: 'TABLET',
        strength: '500mg',
        manufacturerName: 'Pharma Corp',
        manufacturerAddress: '123 Street',
        siteName: 'Plant A',
        manufacturingState: 'MH',
        siteAddress: '123 Street',
        feePaid: true, 
        feeAmount: 50000,
        digitalSigned: true,
        foreignRegulatoryApprovals: '[]',
        organizationId: '00000000-0000-0000-0000-000000000000',
        licenceType: 'MANUFACTURING'
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Application Success:', appResponse.data);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testE2E();
