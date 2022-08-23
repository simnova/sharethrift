import React, {useCallback, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet';
import { Button, Col, DatePicker, Form, Input, Row, Typography } from 'antd';
import { useApolloClient, useMutation } from "@apollo/client";
import { 
    PaymentGetAuthTokenDocument
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

export const Payment2: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [billToStreet, setBillToStreet] = useState("");
    const [billToCity, setBillToCity] = useState("");
    const [billToState, setBillToState] = useState("");
    const [billToZip, setBillToZip] = useState("");
    const [billToCardNumber, setbillToCardNumber] = useState("");
    const [expirationMonth, setExpirationMonth] = useState("");
    const [expirationYear, setExpirationYear] = useState("");
    const [billToCVV, setBillToCVV] = useState("");
    
    const [creditCardInfoToken, setCreditCardInfoToken] = useState("");
    const [isSent, setIsSent] = useState<boolean>(false);
    const [tokenReceived, setTokenReceived] = useState<boolean>(false);
    const [secureToken, setSecureToken] = useState("");
    const [secureTokenID, setSecureTokenID] = useState("");
    const [amount, setAmount] = useState(0);

    const [paypalEndpoint] = useState('https://payflowlink.paypal.com');
    const [paypalMode] = useState('TEST');

    const [getAuthToken,{loading:getAuthTokenLoading, error:getAuthTokenError }] = useMutation(PaymentGetAuthTokenDocument);

    const onChangeExpYear = (date: moment.Moment | null) => {
        if (date !== null) {
            setExpirationYear(date.toDate().getFullYear().toString());
        } else {
            setExpirationYear("");
        }
    };

    const retrieveAuthToken = async () => {
        console.log("retrieveAuthToken");

        await getAuthToken({
            variables: {
                processPaymentRequest: {
                    totalAmount: '900',
                    firstName: firstName,
                    lastName: lastName,
                    address: billToStreet,
                    city: billToCity,
                    state: billToState,
                    postalCode: billToZip,
                    isoCountryCode: "US",
                    additionalProps: {
                        paypalErrorRoute: 'https://payments-east2.azurewebsites.net/api/Paypal/error',
                        paypalSuccessRoute: 'https://payments-east2.azurewebsites.net/api/Paypal/success',
                        paypalCancelRoute: 'https://payments-east2.azurewebsites.net/api/Paypal/cancel'
                    }
                }
            }
        }).then((response) => {
            setSecureToken(response?.data?.getAuthToken?.secureToken as string);
            setSecureTokenID(response?.data?.getAuthToken?.secureTokenId as string);

            setTokenReceived(true);

            console.log('GET_AUTH_TOKEN', response);
        });
    }

    const submitOnMount = React.useCallback(
        (form?: HTMLFormElement) => {
            if (!form) {
                return;
            }
            form.submit();
            setIsSent(true);
        },
        [setIsSent]
    );

    const makePayment = async () => {
        
    }

    const makeRefund = async () => {
        
    }

    const onFinish = (values: any) => {
        console.log("Success:", values);
        retrieveAuthToken();
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    return <>
        <h1>Payment</h1>
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
                            { required: true, message: "Please enter credit card" },
                            {
                            pattern: new RegExp("^[0-9]+$"),
                            message: "Card number must be numerical",
                            },
                        ]}
                        style={{ marginBottom: 0 }}
                        >
                        <Input
                            style={{ margin: "3px" }}
                            type="text"
                            value={billToCardNumber}
                            name="billToCardNumber"
                            maxLength={19}
                            onChange={(e) => setbillToCardNumber(e.target.value)}
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label={"Expiration Date:"}
                        //required={true}
                        style={{ marginBottom: 0 }}
                        >
                        <Input.Group compact style={{ margin: "3px" }}>
                            <Form.Item
                            name="expirationMonth"
                            // rules={[
                            //     { required: true, message: "Please enter month" },
                            //     {
                            //     pattern: new RegExp("^[1-9]$|^0[1-9]$|^1[0-2]$"),
                            //     message: "Enter valid month",
                            //     },
                            // ]}
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
                            //rules={[{ required: true, message: "Please enter year" }]}
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
                            { required: true, message: "Please enter valid CVV Code" },
                            {
                            pattern: new RegExp("^[0-9]+$"),
                            message: "CVV Code must be numerical",
                            },
                        ]}
                        style={{ marginBottom: 0 }}
                        >
                        <Input
                            style={{ margin: "3px" }}
                            type="text"
                            value={billToCVV}
                            name="billToCVV"
                            maxLength={4}
                            onChange={(e) => setBillToCVV(e.target.value)}
                        ></Input>
                    </Form.Item>

                    <Form.Item
                        label=""
                        name="creditCardInfoToken"
                        style={{ marginBottom: 0 }}
                        >
                        <Input
                            style={{ margin: "3px" }}
                            type="hidden"
                            value={creditCardInfoToken}
                            name="creditCardInfoToken"
                            onChange={(e) => setCreditCardInfoToken(e.target.value)}
                        ></Input>
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
                            loading={getAuthTokenLoading}
                        >
                            Get Auth
                        </Button>
                    </Paragraph>
                </Col>
            </Row>
        </Form>
        <Paragraph>
            <iframe
                name='payPalForm'
                title='payPalForm'
                style={{ width: 0, height: 0, border: 0 }}
                onLoad={() => console.log('iframe loaded')}
            />
            {!isSent && tokenReceived && (
                <form
                    id='formPayment'
                    method='POST'
                    action={paypalEndpoint}
                    ref={(e) => submitOnMount(e as HTMLFormElement)}
                >
                    <input type={"hidden"} value={paypalMode} name={"MODE"} />
                    <input type={"hidden"} value={secureToken} name={"SECURETOKEN"} />
                    <input type={"hidden"} value={secureTokenID} name={"SECURETOKENID"} />
                    <input type={"hidden"} value={"S"} name={"TRXTYPE"} />
                    <input type={"hidden"} value={"C"} name={"TENDER"} />
                    <input type={"hidden"} value={billToCardNumber} name={"ACCT"} />
                    <input type={"hidden"} value={amount ?? 0} name={"AMT"} />
                    <input type={"hidden"} value={expirationMonth.padStart(2, "0") + expirationYear} name={"EXPDATE"} />
                    <input type={"hidden"} value={billToCVV} name={"CVV2"} />
                    <input type={"hidden"} value={"true"} name={"SILENTTRAN"} />
                    <input type={"hidden"} value={"HIGH"} name={"VERBOSITY"} />
                    <input type={"hidden"} value={"TRUE"} name={"CSCREQUIRED"} />
                </form>
            )}
            
        </Paragraph>
        {/* <Button
            id="payment-refund-button"
            style={{ marginTop: "10px" }}
            type="primary"
            onClick={() => makeRefund()}
            loading={processRefundLoading}
        >
            Make Refund
        </Button> */}
    </>
}