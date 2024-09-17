import { HEADER_HEIGHT } from '@/application/constants';
import { usePublishContext } from '@/application/publish';
import { UIVariant } from '@/application/types';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as SideOutlined } from '@/assets/side_outlined.svg';
import { Breadcrumb } from '@/components/_shared/breadcrumb';
import MoreActions from '@/components/_shared/more-actions/MoreActions';
import { OutlinePopover } from '@/components/_shared/outline';
import Outline from '@/components/_shared/outline/Outline';
import { useOutlinePopover } from '@/components/_shared/outline/outline.hooks';
import BreadcrumbSkeleton from '@/components/_shared/skeleton/BreadcrumbSkeleton';
import { openOrDownload } from '@/utils/open_schema';
import { getPlatform } from '@/utils/platform';
import { Divider, IconButton, Tooltip } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Duplicate } from './duplicate';

export function PublishViewHeader ({
  drawerWidth, onOpenDrawer, openDrawer, onCloseDrawer,
}: {
  onOpenDrawer: () => void;
  drawerWidth: number;
  openDrawer: boolean;
  onCloseDrawer: () => void
}) {
  const { t } = useTranslation();
  const viewMeta = usePublishContext()?.viewMeta;
  const outline = usePublishContext()?.outline;
  const toView = usePublishContext()?.toView;
  const crumbs = usePublishContext()?.breadcrumbs;

  const {
    openPopover, debounceClosePopover, handleOpenPopover, debounceOpenPopover, handleClosePopover,
  } = useOutlinePopover({
    onOpenDrawer, openDrawer, onCloseDrawer,
  });
  const isMobile = useMemo(() => {
    return getPlatform().isMobile;
  }, []);
  const viewId = viewMeta?.view_id;

  return (
    <div
      style={{
        backdropFilter: 'saturate(180%) blur(16px)',
        background: 'var(--bg-header)',
        height: HEADER_HEIGHT,
        minHeight: HEADER_HEIGHT,
      }}
      className={'appflowy-top-bar transform-gpu sticky top-0 z-10 flex px-5'}
    >
      <div className={'flex w-full items-center justify-between gap-4 overflow-hidden'}>
        {!openDrawer && !isMobile && (
          <OutlinePopover
            {...{
              onMouseEnter: handleOpenPopover,
              onMouseLeave: debounceClosePopover,
            }}
            open={openPopover}
            onClose={debounceClosePopover}
            drawerWidth={drawerWidth}
            content={<Outline
              variant={UIVariant.Publish} selectedViewId={viewId} navigateToView={toView} outline={outline}
              width={drawerWidth}
            />}
          >
            <IconButton
              {...{
                onMouseEnter: debounceOpenPopover,
                onMouseLeave: debounceClosePopover,
                onClick: () => {
                  handleClosePopover();
                  onOpenDrawer();
                },
              }}

            >
              <SideOutlined className={'h-4 w-4 text-text-caption'} />
            </IconButton>
          </OutlinePopover>
        )}

        <div className={'h-full flex-1 overflow-hidden'}>
          {!viewMeta ? <div className={'h-[48px] flex items-center'}><BreadcrumbSkeleton /></div> : <Breadcrumb
            toView={toView}
            crumbs={crumbs || []}
            variant={UIVariant.Publish}
          />}
        </div>

        <div className={'flex items-center gap-2'}>
          <MoreActions />
          <Duplicate />
          <Divider
            orientation={'vertical'}
            className={'mx-2'}
            flexItem
          />
          <Tooltip title={t('publish.downloadApp')}>
            <button onClick={() => openOrDownload()}>
              <Logo className={'h-6 w-6'} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default PublishViewHeader;
