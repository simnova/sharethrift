import SelectAccountType from "./select-account-type";
import { ComponentQueryLoader } from "@sthrift/ui-sharethrift-components";
// import { useQuery, useMutation } from "@apollo/client";
// import {
//     SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
// } from "../../../../generated.tsx";

export default function SelectAccountTypeContainer() {

//   const { data, loading: loadingUser } = useQuery(
//     SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument
//   );

  return (
    <ComponentQueryLoader
      loading={false}
      hasData={{}}
      hasDataComponent={<SelectAccountType />}
    />
  );
}
