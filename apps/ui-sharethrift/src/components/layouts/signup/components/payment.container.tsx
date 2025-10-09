import type { FC } from "react";
import { PaymentForm } from "../../../shared/payment/index.tsx";
import { PaymentContainerPersonalUserCybersourcePublicKeyIdDocument } from "../../../../generated.tsx";
import { useQuery } from "@apollo/client";
import { ComponentQueryLoader } from "@sthrift/ui-components";

export const PaymentContainer: FC = () => {
  const { data, loading, error } = useQuery(PaymentContainerPersonalUserCybersourcePublicKeyIdDocument);

  return (
    <ComponentQueryLoader
      loading={loading}
      error={error}
      hasData={data}
      hasDataComponent={
        <PaymentForm
          cyberSourcePublicKey={
            "eyJraWQiOiJ6dSIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJWLzM2elNVdUxGZjBiNGMyMkgyQW9oQUFFQzdNYzFYWCtkcWdudGxrSUc0SllXVjdROUNSZzhaWWREY2gyZ3FoK0l2S1lWU09QR2FydlRaSVNEKy9lbjJ2VWQrVWlVZ1AxVVNMS2dYZm1zVjcybGcrRzh1WEg4ODhyenNZQ21RUXkwRnRCdEtMbVcxL3NsK2VpYmhwQnFPMnFTeGxObklJL2h5OGYrdDZ4d0Rmek5JZFhpeDdTNGVxY1VBaVMxWUk5LythWmZpaWh3REJROUVsZWxqUDVqeHp2UEFxY2w3a1VwWnJrYjNGRExWdkxlNFx1MDAzZCIsIm9yaWdpbiI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tIiwiandrIjp7Imt0eSI6IlJTQSIsImUiOiJBUUFCIiwidXNlIjoiZW5jIiwibiI6Im9ndERSRFQ4WXFLbFduc3N3X2dQX2dDZjhFMUZ6ZU1YUC1pblBlTTdjVGhnOUx2QXctT0x4QVJmM25sZjJzUmlpUEdiUXZTN1ZmWmp4NlMwVXRMZW1GcUw0eW1SRDZUd1JQZXNsbGpkVUJ6SVh3VzhVa0VXVTBwQ0p6QTQ3cWg5Y0E1OE9WYVVJNGJFOGFyVXplbHgtVzZwY01FbG9VN2lyVUJZRWEzREVZRmd1b1VyMUdsbjhJTzJDLW11MkNrOHBjRkVuamFFcVgtNG16QkxVUEx6bXR1eFhjM0xJYzcyN1lyRU9qNmdkOVljLWtlOXlqQ1Jzajljb19zd1N0cTR4bUlzZmpOOFpva3NGcHRxN0hHTE1laUFWVm1WNi1WeWhDTkpGWnBZQ3dYRG9uZ3hiU2FHZEd0ZHBCcXlFdnV1dFhTQjIyTkNGY3lfNktVZFlHSEN1USIsImtpZCI6IjA4RzU3MmtkZWw2RzNpM05ieXlFMEpGTmVPMEFjOTIwIn19LCJjdHgiOlt7ImRhdGEiOnsiY2xpZW50TGlicmFyeSI6Imh0dHBzOi8vdGVzdGZsZXguY3liZXJzb3VyY2UuY29tL21pY3JvZm9ybS9idW5kbGUvdjEvZmxleC1taWNyb2Zvcm0ubWluLmpzIiwidGFyZ2V0T3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwibWZPcmlnaW4iOiJodHRwczovL3Rlc3RmbGV4LmN5YmVyc291cmNlLmNvbSJ9LCJ0eXBlIjoibWYtMS4wLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNzYwMDIyMDcwLCJpYXQiOjE3NjAwMjExNzAsImp0aSI6Im1KRnljcGR1QXNWalo2UTQifQ.VrajQe-5348Xm1u2zasMgKjqCve_aMEYCOG5J5RxlZklbVCsdX54om7HGkxzeHJLJvzZBZxCuEkLMglskUCkqpj6JQAT4gidHr1rBuUXki4CgLEeCvlMuWeYIyyBtu_CKnEKHvTAFQCEuGtjM8fqiwLJmZM0YpZjf1wMEKHhWt6IVqhUkL-z2Fy5sVE5pheNQel7JRwK8lf5tkVyfhYFaSq9I9YcN0aeAkuZlCiAnNoU6Mjj0Bx6RygYe4sNmCqHYIoyjV-lq_NYvRYEIZV2kb4MJ83ePlJdF2d-P3KpNdy818GC5MvCqbU8RvU4uQ16Brrhgth3pTgTNxgk9t_iEA"
          }
          countries={[]}
        />
      }
    />
  );
};
