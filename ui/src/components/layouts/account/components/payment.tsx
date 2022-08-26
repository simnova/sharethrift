import React, {useEffect, useState} from 'react';
import { Helmet } from 'react-helmet';
import { Button, Col, DatePicker, Form, Input, Row, Typography } from 'antd';
import { useMutation } from "@apollo/client";
import { 
    PaymentLoadPaymentPageDocument,
    PaymentProcessPaymentDocument,
    PaymentProcessRefundDocument
   } from "../../../../generated";

const YearPicker = DatePicker.YearPicker;
const { Paragraph } = Typography;

interface ProcessPaymentReq {
    transactionId: string;
    customerId: string;
    totalAmount: string;
    firstName: string;
    lastName: string;
    address: string;
    locality: string;
    administrativeArea: string;
    postalCode: string;
    country: string;
    merchantDefinedInfo1: string;
    merchantDefinedInfo2: string;
    merchantDefinedInfo3: string;
  }

export const Payment: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [billToStreet, setBillToStreet] = useState("");
    const [billToCity, setBillToCity] = useState("");
    const [billToState, setBillToState] = useState("");
    const [billToZip, setBillToZip] = useState("");
    const [expirationMonth, setExpirationMonth] = useState("");
    const [expirationYear, setExpirationYear] = useState("");
    
    const [transactionId, setTransactionId] = useState("");
    const [requestId, setRequestId] = useState("");

    const [loadPage,{loading:loadPaymentPageLoading, error:loadPaymentPageError }] = useMutation(PaymentLoadPaymentPageDocument);
    const [processPayment,{loading:processPaymentLoading, error:processPaymentError }] = useMutation(PaymentProcessPaymentDocument);
    const [processRefund,{loading:processRefundLoading, error:processRefundError }] = useMutation(PaymentProcessRefundDocument);

    const onChangeExpYear = (date: moment.Moment | null) => {
        if (date !== null) {
            setExpirationYear(date.toDate().getFullYear().toString());
        } else {
            setExpirationYear("");
        }
    };
    
    useEffect(() => {
        loadPaymentPage();
    }, [])

    const loadPaymentPage = async () => {
        console.log("loadPaymentPage");

        await loadPage({
            variables: {}
        }).then((response) => {
            console.log('RESPONSE_FROM_LOAD', response);
            setTransactionId(response?.data?.loadPaymentPage?.transactionId ?? '');
            (window as { [key: string]: any })['createFlexObj'](response?.data?.loadPaymentPage?.keyId)
        });
    }

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    const makePayment = async () => {
        console.log("processPament");

        console.log(`Month : ${expirationMonth} Year : ${expirationYear}`);
        var tokenStuff = await (window as { [key: string]: any})['createToken'](expirationMonth, expirationYear);

        await delay(1000);
        var tokenStuff =  await (window as { [key: string]: any})['returnToken']();
        console.log("processPament-tokenStuff", tokenStuff);
        
        await processPayment({
            variables: {
                processPaymentRequest: {
                    totalAmount: "900",
                    firstName: firstName,
                    lastName: lastName,
                    address: billToStreet,
                    city: billToCity,
                    state: billToState,
                    postalCode: billToZip,
                    isoCountryCode: "EC",
                    customerId: "01234567",
                    originApplication: "Pathways",
                    additionalProps: {
                        transactionId: transactionId,
                        transientTokenJwt: tokenStuff,
                        merchantDefinedInformation3: ""
                    }
                }
            }
        }).then((response) => {
            console.log('RESPONSE_FROM_PAYMENT', response);
            setRequestId(response?.data?.processPayment?.requestId ?? '');
        });
    }

    const makeRefund = async () => {
        await processRefund({
            variables: {
                processRefundRequest: {
                    requestId: requestId,
                    totalAmount: "900"
                }
            }
        }).then((response) => {
            console.log('RESPONSE_FROM_REFUND', response);
        })
    }

    const onFinish = (values: any) => {
        console.log("Success:", values);
        makePayment();
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    return <>
        <h1>Payment</h1>
        <Helmet>
        <style>
            #number-container, #securityCode-container &#123;
              height: 38px;
            &#125;

            .flex-microform-focused &#123;
              background-color: #fff;
              border-color: #80bdff;
              outline: 0;
              box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
            &#125;
        </style>
        <script src="https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js"></script>
        <script>
          console.log('FLEX-Start-Billing');
          var microform;
          var tokenInfo = '';
          var creditCardInfoToken = document.querySelector('#creditCardInfoToken');

          function createFlexObj(keyId) &#123;
            var flex = new Flex(keyId);
            console.log('FLEX-flex', flex);
            console.log('FLEX-keyId', keyId);
            var myStyles = &#123; 
              'input': &#123;    
                'font-size': '14px',    
                'font-family': 'helvetica, tahoma, calibri, sans-serif',    
                'color': '#555',
                'height': '30px'  
              &#125;,  
              ':focus': &#123; 'color': 'blue' &#125;,  
              ':disabled': &#123; 'cursor': 'not-allowed' &#125;,  
              'valid': &#123; 'color': '#3c763d' &#125;,  
              'invalid': &#123; 'color': '#a94442' &#125;
            &#125;;
            microform = flex.microform(&#123; styles: myStyles &#125;);
            var number = microform.createField('number', &#123; placeholder: 'Enter card number' &#125;);
            var securityCode = microform.createField('securityCode', &#123; maxLength: 4, placeholder: '••••' &#125;);

            number.load('#number-container');
            securityCode.load('#securityCode-container');
          &#125;

          async function createToken(expirationMonth, expirationYear) &#123;
            var options = &#123;
              expirationMonth: expirationMonth,
              expirationYear: expirationYear,
            &#125;;

            return await microform.createToken(options, function (err, token) &#123;
              if (err) &#123;
                console.log('FLEX-CREATETOKEN-ERR', err);
              &#125; else &#123;
                console.log('SUCCESS', JSON.stringify(token));
                tokenInfo = JSON.stringify(token);
              &#125;
            &#125;);
          &#125;;

          function returnToken() &#123;
            return tokenInfo;
          &#125;;
          console.log('FLEX-End-Billing');
        </script>
        </Helmet>
        <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row>
                <Col>
                    <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                        { required: true, message: "Please enter first name" },
                    ]}
                    style={{ marginBottom: 0 }}
                    >
                        <Input
                            style={{ margin: "3px" }}
                            type="text"
                            value={firstName}
                            name="firstName"
                            onChange={(e) => setFirstName(e.target.value)}
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            { required: true, message: "Please enter last name" },
                        ]}
                        style={{ marginBottom: 0 }}
                        >
                        <Input
                            style={{ margin: "3px" }}
                            type="text"
                            value={lastName}
                            name="lastName"
                            onChange={(e) => setLastName(e.target.value)}
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label="Street Address 1"
                        name="billToStreet"
                        rules={[
                            { required: true, message: "Please enter street address" },
                        ]}
                        style={{ marginBottom: 0 }}
                        >
                        <Input
                            style={{ margin: "3px" }}
                            type="text"
                            value={billToStreet}
                            name="billToStreet"
                            onChange={(e) => setBillToStreet(e.target.value)}
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="billToCity"
                        style={{ marginBottom: 0 }}
                        >
                        <Input
                            style={{ margin: "3px" }}
                            type="text"
                            value={billToCity}
                            name="billToCity"
                            onChange={(e) => setBillToCity(e.target.value)}
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label="State/Province"
                        name="billToState"
                        style={{ marginBottom: 0 }}
                        >
                        <Input
                            style={{ margin: "3px" }}
                            type="text"
                            value={billToState}
                            name="billToState"
                            onChange={(e) => setBillToState(e.target.value)}
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label="Zip"
                        name="billToZip"
                        style={{ marginBottom: 0 }}
                        >
                        <Input
                            style={{ margin: "3px" }}
                            type="text"
                            value={billToZip}
                            name="billToZip"
                            onChange={(e) => setBillToZip(e.target.value)}
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label={"Credit Card Number"}
                        name="billToCardNumber"
                        rules={[
                            { required: false, message: "Please enter credit card" },
                            {
                            pattern: new RegExp("^[0-9]+$"),
                            message: "Card number must be numerical",
                            },
                        ]}
                        style={{ marginBottom: 0 }}
                        >
                        <div id="number-container"></div>
                    </Form.Item>

                    <Form.Item
                        label={"Expiration Date:"}
                        required={true}
                        style={{ marginBottom: 0 }}
                        >
                        <Input.Group compact style={{ margin: "3px" }}>
                            <Form.Item
                            name="expirationMonth"
                            rules={[
                                { required: true, message: "Please enter month" },
                                {
                                pattern: new RegExp("^[1-9]$|^0[1-9]$|^1[0-2]$"),
                                message: "Enter valid month",
                                },
                            ]}
                            style={{ marginBottom: 0 }}
                            >
                            <Input
                                id="expirationMonth"
                                style={{ width: "100%" }}
                                type="text"
                                value={expirationMonth}
                                name="expirationMonth"
                                placeholder="Month"
                                maxLength={2}
                                onChange={(e) => setExpirationMonth(e.target.value)}
                            ></Input>
                            </Form.Item>
                            <Form.Item
                            name="expirationYear"
                            rules={[{ required: true, message: "Please enter year" }]}
                            style={{ marginBottom: 0 }}
                            >
                            <YearPicker
                                format={"YY"}
                                placeholder="Year"
                                onChange={(date: any) => onChangeExpYear(date)}
                            ></YearPicker>
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>

                    <Form.Item
                        label="CVV Code"
                        name="billToCVV"
                        rules={[
                            { required: false, message: "Please enter valid CVV Code" },
                            {
                            pattern: new RegExp("^[0-9]+$"),
                            message: "CVV Code must be numerical",
                            },
                        ]}
                        style={{ marginBottom: 0 }}
                        >
                        <div id="securityCode-container"></div>
                    </Form.Item>

                </Col>
            </Row>
            <Row>
                <Col>
                    <Paragraph style={{ textAlign: "right" }}>
                        <Button
                            id="payment-continue-button"
                            style={{ marginTop: "10px" }}
                            type="primary"
                            htmlType="submit"
                            loading={processPaymentLoading}
                        >
                            Make Payment
                        </Button>
                    </Paragraph>
                </Col>
            </Row>
        </Form>
        <Button
            id="payment-refund-button"
            style={{ marginTop: "10px" }}
            type="primary"
            onClick={() => makeRefund()}
            loading={processRefundLoading}
        >
            Make Refund
        </Button>
    </>
}