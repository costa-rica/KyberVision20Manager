import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import TemplateView from "../../components/TemplateView";

const AdminDbTable = () => {
  const router = useRouter();
  const { name_of_table } = router.query;

  const TableComponent = dynamic(() => {
    console.log("-----> name_of_table", name_of_table);
    if (name_of_table === "manage-db-backups") {
      return import(`../../components/admin-db/ManageDbBackups`).catch(
        () => () => <p>Table Not Found</p>
      );
    } else if (name_of_table === "manage-db-uploads") {
      return import(`../../components/admin-db/ManageDbUploads`).catch(
        () => () => <p>Table Not Found</p>
      );
    } else if (name_of_table === "manage-db-deletes") {
      return import(`../../components/admin-db/ManageDbDeletes`).catch(
        () => () => <p>Table Not Found</p>
      );
    } else {
      return import(`../../components/admin-db/${name_of_table}Table`).catch(
        () => () => <p>Table Not Found</p>
      );
    }
  });

  return (
    <TemplateView>
      <TableComponent />
    </TemplateView>
  );
};

export default AdminDbTable;
