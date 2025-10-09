import { Button, Form, message } from "antd";
import dayjs from "dayjs";
import { useState, type FC, useEffect } from "react";
import { PaymentTokenFormItems, type PaymentTokenFormFieldType, type TokenOptions } from "./payment-token-form-items.tsx";
import { BillingAddressForm } from "./billing-address-form-items.tsx";
import type { Country } from "./country-type.ts";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

interface PaymentFormProps {
  cyberSourcePublicKey: string;
  countries: Country[];
}
export const PaymentForm: FC<PaymentFormProps> = (props) => {
  const [form] = Form.useForm();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [flexMicroform, setFlexMicroform] = useState<any>(null);
  const [cyberSourcePublicKey, setCyberSourcePublicKey] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/flex/v2/capture-contexts", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setCyberSourcePublicKey(data.captureContext));
  }, []);

  const createToken = (tokenOption: TokenOptions) => {
    return new Promise((resolve, reject) => {
      if (flexMicroform === null) {
        message.error("Flex Microform is not loaded.");
        reject(new Error("Flex Microform is not loaded."));
        return;
      }

      flexMicroform.createToken(tokenOption, (error: Error | null, token: string) => {
        if (error) {
          console.log("CREATE TOKEN ERROR", error);
          reject(error);
        } else {
          console.log("TOKEN CREATED", token);
          form.setFieldsValue({ paymentInstrumentToken: token });
          resolve(token);
        }
      });
    });
  };

  const onSubmitPaymentTokenForm = async (values: PaymentTokenFormFieldType) => {
    const tokenOption: TokenOptions = {
      expirationMonth: dayjs(values.expiration).utc().format("MM"),
      expirationYear: dayjs(values.expiration).utc().format("YYYY"),
    };

    try {
      await createToken(tokenOption);
    } catch (error) {
      console.log("Error creating token:", error);
      message.error("An error occurred while creating the payment token.");
    }
  };
  const onSubmit = () => {
    form.validateFields().then(async () => {
      await onSubmitPaymentTokenForm(form.getFieldsValue());
    });
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleMicroformCreated = (microform: any) => {
    setFlexMicroform(microform);
  };

  const handleCardNumberChange = (isEmpty: boolean) => {
    if (isEmpty) {
      form.setFieldsValue({ cardNumber: undefined });
      return;
    }

    form.setFieldsValue({ cardNumber: "**** **** **** ****" }); // random string to suppress required validation error
  };

  const handleSecurityCodeChange = (isEmpty: boolean) => {
    if (isEmpty) {
      form.setFieldsValue({ securityCode: undefined });
      return;
    }
    form.setFieldsValue({ securityCode: "***" }); // random string to suppress required validation error
  };

  return (
    <Form layout="vertical" form={form}>
      <p>
        Payment must be made by credit card. We accept Visa, MasterCard, Discover, and American Express. Please enter the information for the credit
        card you will use for payment in the fields below.
      </p>

      {/* card number, security code, expiration date fields*/}
      <PaymentTokenFormItems
        cyberSourcePublicKey={cyberSourcePublicKey}
        onMicroformCreated={handleMicroformCreated}
        onCardNumberChange={handleCardNumberChange}
        onSecurityCodeChange={handleSecurityCodeChange}
      />

      <BillingAddressForm countries={props.countries} />
      <Form.Item>
        <Button type="primary" onClick={onSubmit}>
          {"Submit Payment"}
        </Button>
      </Form.Item>
    </Form>
  );
};
