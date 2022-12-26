import { Environment } from '@/react/portainer/environments/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { Datatable as GenericDatatable } from '@@/datatables';
import { Button } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';
import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';

import { useAssociateDeviceMutation, useLicenseOverused } from '../queries';

import { columns } from './columns';
import { Filter } from './Filter';
import { useEnvironments } from './useEnvironments';

const storageKey = 'edge-devices-waiting-room';

const settingsStore = createPersistedStore(storageKey, 'Name');

export function Datatable() {
  const associateMutation = useAssociateDeviceMutation();
  const licenseOverused = useLicenseOverused();
  const tableState = useTableState(settingsStore, storageKey);
  const { data: environments, totalCount, isLoading } = useEnvironments();

  return (
    <GenericDatatable
      settingsManager={tableState}
      columns={columns}
      dataset={environments}
      title="Edge Devices Waiting Room"
      emptyContentLabel="No Edge Devices found"
      renderTableActions={(selectedRows) => (
        <>
          <Button
            onClick={() => handleAssociateDevice(selectedRows)}
            disabled={selectedRows.length === 0 || licenseOverused}
          >
            Associate Device
          </Button>

          {licenseOverused ? (
            <div className="ml-2 mt-2">
              <TextTip color="orange">
                Associating devices is disabled as your node count exceeds your
                license limit
              </TextTip>
            </div>
          ) : null}
        </>
      )}
      isLoading={isLoading}
      totalCount={totalCount}
      description={<Filter />}
    />
  );

  function handleAssociateDevice(devices: Environment[]) {
    associateMutation.mutate(
      devices.map((d) => d.Id),
      {
        onSuccess() {
          notifySuccess('Success', 'Edge devices associated successfully');
        },
      }
    );
  }
}
