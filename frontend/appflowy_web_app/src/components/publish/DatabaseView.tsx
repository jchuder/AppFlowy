import {
  AppendBreadcrumb,
  CreateRowDoc,
  LoadView,
  LoadViewMeta,
  YDatabase,
  YDoc,
  YjsEditorKey,
} from '@/application/types';
import { usePublishContext } from '@/application/publish';
import ComponentLoading from '@/components/_shared/progress/ComponentLoading';
import { Database } from '@/components/database';
import DatabaseHeader from '@/components/database/components/header/DatabaseHeader';
import { ViewMetaProps } from '@/components/view-meta';
import React, { Suspense, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DatabaseProps {
  doc: YDoc;
  createRowDoc?: CreateRowDoc;
  loadView?: LoadView;
  navigateToView?: (viewId: string) => Promise<void>;
  loadViewMeta?: LoadViewMeta;
  viewMeta: ViewMetaProps;
  appendBreadcrumb?: AppendBreadcrumb;
}

function DatabaseView ({ viewMeta, ...props }: DatabaseProps) {
  const [search, setSearch] = useSearchParams();
  const visibleViewIds = useMemo(() => viewMeta.visibleViewIds || [], [viewMeta]);

  const isTemplateThumb = usePublishContext()?.isTemplateThumb;
  const iidIndex = viewMeta.viewId;
  const viewId = useMemo(() => {
    return search.get('v') || iidIndex;
  }, [search, iidIndex]);

  const handleChangeView = useCallback(
    (viewId: string) => {
      setSearch(prev => {
        prev.set('v', viewId);
        return prev;
      });
    },
    [setSearch],
  );

  const handleNavigateToRow = useCallback(
    (rowId: string) => {
      setSearch(prev => {
        prev.set('r', rowId);
        return prev;
      });
    },
    [setSearch],
  );

  const rowId = search.get('r') || undefined;
  const doc = props.doc;
  const database = doc?.getMap(YjsEditorKey.data_section)?.get(YjsEditorKey.database) as YDatabase;

  if (!viewId || !database) return null;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 48px)',
        maxWidth: isTemplateThumb ? '964px' : undefined,
      }}
      className={'relative flex h-full w-full flex-col px-6'}
    >
      {rowId ? null : <DatabaseHeader {...viewMeta} />}

      <Suspense fallback={<ComponentLoading />}>
        <Database
          iidName={viewMeta.name || ''}
          iidIndex={iidIndex || ''}
          {...props}
          viewId={viewId}
          rowId={rowId}
          visibleViewIds={visibleViewIds}
          onChangeView={handleChangeView}
          hideConditions={true}
          onOpenRow={handleNavigateToRow}
        />
      </Suspense>
    </div>
  );
}

export default DatabaseView;
