import { Column } from 'react-table';
import { useStore } from 'zustand';
import { Share2, Trash2 } from 'react-feather';
import clsx from 'clsx';

import { useUser } from '@/portainer/hooks/useUser';

import { ExpandableDatatable } from '@@/datatables/ExpandableDatatable';
import { useSearchBarState } from '@@/datatables/SearchBar';
import {
  BasicTableSettings,
  createPersistedStore,
  refreshableSettings,
  RefreshableTableSettings,
} from '@@/datatables/types';
import { TextTip } from '@@/Tip/TextTip';
import { Button } from '@@/buttons';
import { TableSettingsMenu } from '@@/datatables';
import { TableSettingsMenuAutoRefresh } from '@@/datatables/TableSettingsMenuAutoRefresh';
import { Checkbox } from '@@/form-components/Checkbox';
import { useRepeater } from '@@/datatables/useRepeater';
import { buildExpandColumn } from '@@/datatables/expand-column';
// import { Link } from '@@/Link';
// import { Icon } from '@@/Icon';
import { DockerNetwork } from '../types';
import { ResourceControlViewModel } from '@/react/portainer/access-control/models/ResourceControlViewModel';

type DockerNetworkViewModel = DockerNetwork & {
  StackName?: string;
  ResourceControl?: ResourceControlViewModel;
  NodeName?: string;
  Subs?: DockerNetworkViewModel[];
  Highlighted: boolean;
};

const storageKey = 'docker.networks';

interface TableSettings extends BasicTableSettings, RefreshableTableSettings {
  showSystem: boolean;
  setShowSystem: (showSystem: boolean) => void;
}

const settingsStore = createPersistedStore<TableSettings>(
  storageKey,
  'name',
  (set) => ({
    showSystem: false,
    setShowSystem: (showSystem: boolean) => set({ showSystem }),
    ...refreshableSettings(set),
  })
);

const columns: Array<Column<DockerNetworkViewModel>> = [
  buildExpandColumn<DockerNetworkViewModel>(
    (item) => !!(item.Subs && item.Subs?.length > 0)
  ),
  {
    id: 'name',
    Header: 'Name',
    accessor: 'Name',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'stack',
    Header: 'Stack',
    accessor: 'StackName',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'driver',
    Header: 'Driver',
    accessor: 'Driver',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'attachable',
    Header: 'Attachable',
    accessor: 'Attachable',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'IPAMDriver',
    Header: 'IPAM Driver',
    accessor: (row) => row.IPAM.Driver,
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'IPV4Subnet',
    Header: 'IPV4 IPAM Subnet',
    accessor: (row) => row.IPAM?.IPV4Configs[0]?.Subnet ?? '-',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'IPV4Gateway',
    Header: 'IPV4 IPAM Gateway',
    accessor: (row) => row.IPAM?.IPV4Configs[0]?.Gateway ?? '-',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'IPV6Subnet',
    Header: 'IPV6 IPAM Subnet',
    accessor: (row) => row.IPAM?.IPV6Configs[0]?.Subnet ?? '-',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'IPV6Gateway',
    Header: 'IPV6 IPAM Gateway',
    accessor: (row) => row.IPAM?.IPV6Configs[0]?.Gateway ?? '-',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },
  {
    id: 'node',
    Header: 'Node',
    accessor: (row) => row.NodeName,
    disableFilters: true,
    Filter: () => null,
    canHide: true,
  },
  {
    id: 'ownership',
    Header: 'Ownership',
    accessor: (row) => row.ResourceControl?.Ownership,
    disableFilters: true,
    Filter: () => null,
    canHide: false,
  },

  // {
  //   id: 'namespace',
  //   Header: 'Namespace',
  //   accessor: 'ResourcePool',
  //   Cell: ({ value }: CellProps<Stack, string>) => (
  //     <>
  //       <Link to="kubernetes.resourcePools.resourcePool" params={{ id: value }}>
  //         {value}
  //       </Link>
  //       {KubernetesNamespaceHelper.isSystemNamespace(value) && (
  //         <span className="label label-info image-tag label-margins">
  //           system
  //         </span>
  //       )}
  //     </>
  //   ),
  //   disableFilters: true,
  //   Filter: () => null,
  //   canHide: false,
  // },
  // {
  //   id: 'applications',
  //   Header: 'Applications',
  //   accessor: (row) => row.Applications.length,
  //   disableFilters: true,
  //   Filter: () => null,
  //   canHide: false,
  // },
  // {
  //   id: 'actions',
  //   Header: 'Actions',
  //   disableFilters: true,
  //   Filter: () => null,
  //   canHide: false,
  //   Cell: ({ row: { original: item } }: CellProps<Stack>) => (
  //     <Link
  //       to="kubernetes.stacks.stack.logs"
  //       params={{ namespace: item.ResourcePool, name: item.Name }}
  //       className="vertical-center"
  //     >
  //       <Icon icon={FileText} size="md" />
  //       Logs
  //     </Link>
  //   ),
  // },
];

type DatasetType = Array<DockerNetworkViewModel>;
interface Props {
  dataset: DatasetType;
  onRemove(selectedItems: DatasetType): void;
  onRefresh(): Promise<void>;
}

export function NetworksDatatable({ dataset, onRemove, onRefresh }: Props) {
  const settings = useStore(settingsStore);
  const [search, setSearch] = useSearchBarState(storageKey);
  const { isAdmin } = useUser();

  useRepeater(settings.autoRefreshRate, onRefresh);

  return (
    <ExpandableDatatable<DockerNetworkViewModel>
      title="Networks"
      titleIcon={Share2}
      dataset={dataset}
      columns={columns}
      initialPageSize={settings.pageSize}
      onPageSizeChange={settings.setPageSize}
      initialSortBy={settings.sortBy}
      onSortByChange={settings.setSortBy}
      searchValue={search}
      onSearchChange={setSearch}
      renderSubRow={(row) => (
        <>
          {row.original.Subs &&
            row.original.Subs.map((network, idx) => (
              <tr
                key={`${network.Id}-${idx}`}
                className={clsx({
                  'datatable-highlighted': row.original.Highlighted,
                  'datatable-unhighlighted': !row.original.Highlighted,
                })}
              >
                <td />
                <td>TEST</td>
                {/* <td colSpan={row.cells.length - 1}>
                <Link
                  to="kubernetes.applications.application"
                  params={{ name: app.Name, namespace: app.ResourcePool }}
                >
                  {app.Name}
                </Link>
                {KubernetesNamespaceHelper.isSystemNamespace(
                  app.ResourcePool
                ) &&
                  KubernetesApplicationHelper.isExternalApplication(app) && (
                    <span className="space-left label label-primary image-tag">
                      external
                    </span>
                  )}
              </td> */}
              </tr>
            ))}
        </>
      )}
      // noWidget
      emptyContentLabel="No networks available."
      description={
        isAdmin &&
        !settings.showSystem && (
          <TextTip color="blue">
            System resources are hidden, this can be changed in the table
            settings.
          </TextTip>
        )
      }
      renderTableActions={(selectedRows) => (
        <Button
          disabled={selectedRows.length === 0}
          color="dangerlight"
          onClick={() => onRemove(selectedRows)}
          icon={Trash2}
        >
          Remove
        </Button>
      )}
      renderTableSettings={() => (
        <TableSettingsMenu>
          <Checkbox
            id="settings-show-system"
            label="Show system resources"
            checked={settings.showSystem}
            onChange={(e) => settings.setShowSystem(e.target.checked)}
          />
          <TableSettingsMenuAutoRefresh
            onChange={settings.setAutoRefreshRate}
            value={settings.autoRefreshRate}
          />
        </TableSettingsMenu>
      )}
      getRowId={(row) => `${row.Name}-${row.Id}`}
    />
  );
}
