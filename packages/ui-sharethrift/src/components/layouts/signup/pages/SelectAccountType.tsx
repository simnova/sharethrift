import { useState } from "react";
import { Button, Card } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import stool from "../../../../../src/assets/item-images/stool.png";
import armchair from "../../../../../src/assets/item-images/armchair.png";
import bubbleChair from "../../../../../src/assets/item-images/bubble-chair.png";

type PersonalAccountSubType = "non-verified" | "verified" | "verified-plus";

interface AccountOption {
  id: string;
  title: string;
  price: string;
  features: string[];
  icon?: string;
}

const personalOptions: AccountOption[] = [
  {
    id: "non-verified",
    title: "Non-Verified Personal",
    price: "$0/month",
    features: [
      "5 active reservations",
      "3 bookmarks",
      "15 items to share",
      "5 friends",
    ],
    icon: stool,
  },
  {
    id: "verified",
    title: "Verified Personal",
    price: "$0/month",
    features: [
      "10 active reservations",
      "10 bookmarks",
      "30 items to share",
      "10 friends",
    ],
    icon: armchair,
  },
  {
    id: "verified-plus",
    title: "Verified Personal Plus",
    price: "$4.99/month",
    features: [
      "30 active reservations",
      "30 bookmarks",
      "50 items to share",
      "30 friends",
    ],
    icon: bubbleChair,
  },
];

export default function SelectAccountType() {
  const [selectedPersonalType, setSelectedPersonalType] =
    useState<PersonalAccountSubType>("verified");

  const renderAccountCard = (
    option: AccountOption,
    isSelected: boolean,
    onSelect: () => void
  ) => (
    <Card
      key={option.id}
      className={`cursor-pointer transition-all duration-200 ${
        isSelected ? "shadow-lg" : "hover:shadow-md"
      }`}
      style={{
        width: 280,
        // height: 320,
        position: "relative",
        border: isSelected
          ? "2px solid var(--color-secondary)"
          : "1px solid var(--color-foreground-2)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      styles={{
        body: {
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          height: "100%",
          position: "relative",
        },
      }}
      onClick={onSelect}
    >
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "var(--color-secondary)",
            borderRadius: "50%",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: 1,
          }}
        >
        </div>
      )}

      <div
        style={{
          fontSize: "60px",
          marginBottom: "20px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={option.icon}
          style={{ height: 100, width: "auto", objectFit: "contain" }}
        />
      </div>

      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "12px",
          minHeight: "48px",
          display: "flex",
          alignItems: "center",
          color: "var(--color-message-text)",
          textAlign: "center",
        }}
      >
        {option.title}
      </h3>

      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "var(--color-secondary)",
          marginBottom: "20px",
        }}
      >
        {option.price}
      </div>

      <div
        style={{
          textAlign: "left",
          fontSize: "13px",
          lineHeight: "1.5",
          flex: 1,
          color: "var(--color-message-text)",
        }}
      >
        {option.features.map((feature, index) => (
          <div key={index} style={{ marginBottom: "6px" }}>
            • {feature}
          </div>
        ))}
      </div>
    </Card>
  );

  const personalTabContent = (
    <div style={{ padding: "24px 0" }}>
      <div
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {personalOptions.map((option) =>
          renderAccountCard(option, selectedPersonalType === option.id, () =>
            setSelectedPersonalType(option.id as PersonalAccountSubType)
          )
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginTop: "32px",
        }}
      >
        {/* {selectedPersonalType === "verified" || sel
        selectedPersonalType === "verified-plus" ? ( */}
        <Button type="primary" size="large">
          <SafetyOutlined /> Start Identity Verification
        </Button>
        {/* ) : null} */}
      </div>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <h1
        className="title36"
        style={{
          textAlign: "center",
          marginBottom: "32px",
          color: "var(--color-message-text)",
        }}
      >
        Account Type and Plan
      </h1>
      {personalTabContent}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "32px",
        }}
      >
        <Button type="default" size="large">
          Save and Continue
        </Button>
      </div>
    </div>
  );
}
