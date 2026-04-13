import { useState, useEffect } from "react";
import { Button, Card } from "antd";
import { CheckOutlined, SafetyOutlined } from "@ant-design/icons";
import type { AccountPlan, PersonalUser, PersonalUserUpdateInput } from "../../../../generated.tsx";

const getPlanIcon = (planName: string) => {
  switch (planName) {
    case "non-verified-personal":
      return "/assets/item-images/stool.png";
    case "verified-personal":
      return "/assets/item-images/armchair.png";
    case "verified-personal-plus":
      return "/assets/item-images/bubble-chair.png";
    default:
      return "/assets/images/plan-icons/default.png";
  }
};

const getBillingFeeDisplay = (plan: AccountPlan) => {
  return `$${plan.billingAmount}/${plan.billingPeriodUnit}`;
};

const getPlanFeaturesDisplay = (plan: AccountPlan) => {
  const features = [];
  if (plan.feature.activeReservations !== undefined) {
    features.push(`${plan.feature.activeReservations} active reservations`);
  }
  if (plan.feature.bookmarks !== undefined) {
    features.push(`${plan.feature.bookmarks} bookmarks`);
  }
  if (plan.feature.itemsToShare !== undefined) {
    features.push(`${plan.feature.itemsToShare} items to share`);
  }
  if (plan.feature.friends !== undefined) {
    features.push(`${plan.feature.friends} friends`);
  }
  return features;
};
interface SelectAccountTypeProps {
  currentUserData?: PersonalUser;
  loading: boolean;
  onSaveAndContinue: (values: PersonalUserUpdateInput) => void;
  accountPlans: AccountPlan[];
}

export const SelectAccountType: React.FC<SelectAccountTypeProps> = (props) => {
  const [selectedPersonalType, setSelectedPersonalType] = useState<string>("non-verified-personal");

  useEffect(() => {
    setSelectedPersonalType(props?.currentUserData?.account?.accountType ?? "non-verified-personal");
  }, [props?.currentUserData]);

  const handleSelectAccountType = (accountPlanName: string) => {
    setSelectedPersonalType(accountPlanName);
  };

  const handleSaveAndContinue = () => {
    props.onSaveAndContinue({
      id: props?.currentUserData?.id,
      account: {
        accountType: selectedPersonalType,
      },
    });
  };

  const renderAccountCard = (plan: AccountPlan, isSelected: boolean, onSelect: () => void) => (
    <Card
      key={plan.id}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? "shadow-lg" : "hover:shadow-md"}`}
      style={{
        width: 280,
        position: "relative",
        border: isSelected ? "2px solid var(--color-secondary)" : "1px solid var(--color-foreground-2)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      styles={{
        body: {
          padding: "10px 20px",
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginBottom: 12,
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--color-message-text)",
            textAlign: "left",
            margin: 0,
            flex: 1,
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {plan.description}
        </h3>
        <div
          style={{
            marginLeft: 8,
            border: `1px solid ${isSelected ? "var(--color-secondary)" : "grey"}`,
            backgroundColor: isSelected ? "var(--color-secondary)" : "transparent",
            borderRadius: "50%",
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: 1,
          }}
        >
          {isSelected ? <CheckOutlined /> : null}
        </div>
      </div>

      <div
        style={{
          fontSize: "60px",
          marginBottom: "20px",
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={getPlanIcon(plan.name)} alt={plan.description ?? ""} style={{ height: 150, width: "auto", objectFit: "contain" }} />
      </div>

      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "var(--color-secondary)",
          marginBottom: "20px",
        }}
      >
        {getBillingFeeDisplay(plan)}
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
        {getPlanFeaturesDisplay(plan).map((feature) => (
          <div key={feature} style={{ marginBottom: "6px" }}>
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
        {props.accountPlans.map((plan) => renderAccountCard(plan, selectedPersonalType === plan.name, () => handleSelectAccountType(plan.name)))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginTop: "32px",
        }}
      >
        <Button type="primary" size="large">
          <SafetyOutlined /> Start Identity Verification
        </Button>
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
        <Button type="default" size="large" onClick={handleSaveAndContinue} loading={props.loading}>
          Save and Continue
        </Button>
      </div>
    </div>
  );
};
