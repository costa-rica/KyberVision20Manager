import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import TemplateView from "../../components/TemplateView";

// // Import your components dynamically
// const components = {
//   teams: dynamic(() => import('../../components/TeamsTable')),
//   player: dynamic(() => import('../../components/PlayersTable')),
//   league: dynamic(() => import('../../components/LeaguesTable')),
// };

const AdminDbTable = () => {
  const router = useRouter();
  const { name_of_table } = router.query;

  const TableComponent = dynamic(() =>
    import(`../../components/admin-db/${name_of_table}Table`).catch(
      () => () => <p>Table Not Found</p>
    )
  );
  //   // Select the appropriate table component
  //   const TableComponent = components[name_of_table] || (() => <p>Table Not Found</p>);

  return (
    <TemplateView>
      <TableComponent />
    </TemplateView>
  );
};

export default AdminDbTable;
