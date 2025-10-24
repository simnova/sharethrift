import { Row, Col, Input, Form, Select } from "antd";
import { useState, type FC } from "react";
import type { Country, State } from "./country-type.ts";

const COLUMN_SPAN = 24 / 2;

interface BillingAddressFormItemsProps {
  countries: Country[];
}

type Rule = {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
};

export const BillingAddressFormItems: FC<BillingAddressFormItemsProps> = (props) => {
  const [zipCodeRules, setZipCodeRules] = useState<Rule[]>([{ required: true, message: "Please enter the ZIP/Postal code." }]);
  const form = Form.useFormInstance();
  const selectedCountry = Form.useWatch("country", form);

  const onCountryChange = (value: string) => {
    form.resetFields(["state"]);

    switch (value) {
      case "US":
        setZipCodeRules([
          { required: true, message: "Please enter the ZIP/Postal code" },
          {
            pattern: /^\d{5}(?:[-\s]\d{4})?$/,
            message: "Please enter a valid ZIP/Postal code",
          },
        ]);
        break;
      case "CA":
        setZipCodeRules([
          { required: true, message: "Please enter the ZIP/Postal code" },
          {
            pattern: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
            message: "Please enter a valid ZIP/Postal code",
          },
        ]);
        break;
      default:
        setZipCodeRules([{ required: true, message: "Please enter the ZIP/Postal code" }]);
        break;
    }
  };

  const renderStateFormItem = () => {
    const states = props.countries?.find((country: Country) => country.countryCode === selectedCountry)?.states;
    if (states && states.length > 0) {
      return (
        <Form.Item label="State / Province" name="state" rules={[{ required: true, message: "Please enter the state." }]}>
          <Select
            optionFilterProp="children"
            showSearch
            filterOption={(input, option) => (option?.label ? option?.label.toString().toLowerCase().includes(input.toLowerCase()) : false)}
            options={states.map((d: State) => ({
              value: d.stateCode,
              label: d.stateName,
            }))}
          />
        </Form.Item>
      );
    } else {
      return (
        <Form.Item label="Billing State / Province" name="state" rules={[{ required: true, message: "Please enter the state." }]}>
          <Input type="text" placeholder="Billing State / Province" />
        </Form.Item>
      );
    }
  };
  return (
    <>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item label="First Name on Card" name="billingFirstName" rules={[{ required: true, message: "Please enter valid First Name" }]}>
            <Input placeholder="First Name on Card" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Last Name on Card " name="billingLastName" rules={[{ required: true, message: "Please enter valid Last Name" }]}>
            <Input placeholder="Last Name on Card" />
          </Form.Item>
        </Col>
        <Form.Item name="paymentInstrumentToken" hidden>
          <Input />
        </Form.Item>
      </Row>

      <Row>
        <Col span={COLUMN_SPAN * 2} xs={24}>
          <Form.Item
            label="Email Address"
            name="billingEmail"
            rules={[
              {
                required: true,
                message: "Please enter a valid email address.",
              },
              {
                type: "email",
                message: "Please enter a valid email address.",
              },
            ]}
          >
            <Input type="text" maxLength={500} placeholder="Email Address" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={COLUMN_SPAN * 2} xs={24}>
          <Form.Item name={"country"} label={"Country"} rules={[{ required: true, message: "Please select the country." }]}>
            <Select placeholder="Country" onChange={onCountryChange} showSearch optionFilterProp="children">
              {props.countries?.map((item: Country) => (
                <Select.Option key={item.countryCode} value={item.countryCode}>
                  {item.countryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={COLUMN_SPAN * 2} xs={24}>
          <Form.Item
            label="Billing Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please enter the billing street address.",
              },
            ]}
          >
            <Input placeholder="Billing Address" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={COLUMN_SPAN} xs={24}>
          <Form.Item
            label="Billing City"
            name="city"
            rules={[
              { required: true, message: "Please enter the billing city." },
              {
                max: 500,
                message: "City name cannot exceed 500 characters.",
              },
            ]}
          >
            <Input placeholder="Billing City" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={COLUMN_SPAN} xs={24}>
          {renderStateFormItem()}
        </Col>
      </Row>
      <Row>
        <Col span={COLUMN_SPAN} xs={24}>
          <Form.Item label="Billing ZIP / Postal Code" name="billingPostalCode" rules={zipCodeRules}>
            <Input placeholder="Billing ZIP / Postal Code" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
