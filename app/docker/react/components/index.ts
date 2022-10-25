import angular from 'angular';

import { r2a } from '@/react-tools/react2angular';
import { StackContainersDatatable } from '@/react/docker/stacks/ItemView/StackContainersDatatable';
import { ContainerQuickActions } from '@/react/docker/containers/components/ContainerQuickActions';
import { TemplateListDropdownAngular } from '@/react/docker/app-templates/TemplateListDropdown';
import { TemplateListSortAngular } from '@/react/docker/app-templates/TemplateListSort';
import { Gpu } from '@/react/docker/containers/CreateView/Gpu';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withReactQuery } from '@/react-tools/withReactQuery';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { NetworksDatatable } from '@/react/docker/networks/ListView/NetworksDatatable';

export const componentsModule = angular
  .module('portainer.docker.react.components', [])
  .component(
    'containerQuickActions',
    r2a(withUIRouter(withCurrentUser(ContainerQuickActions)), [
      'containerId',
      'nodeName',
      'state',
      'status',
      'taskId',
    ])
  )
  .component('templateListDropdown', TemplateListDropdownAngular)
  .component('templateListSort', TemplateListSortAngular)
  .component(
    'stackContainersDatatable',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(StackContainersDatatable))),
      ['environment', 'stackName']
    )
  )
  .component('networksDatatable', r2a(withCurrentUser(NetworksDatatable), [
    'dataset',
    'onRefresh',
    'onRemove'
  ]))
  .component(
    'gpu',
    r2a(Gpu, ['values', 'onChange', 'gpus', 'usedGpus', 'usedAllGpus'])
  ).name;
