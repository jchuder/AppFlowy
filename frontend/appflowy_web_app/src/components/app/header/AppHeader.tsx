import { UIVariant } from '@/application/types';
import { Breadcrumb } from '@/components/_shared/breadcrumb';
import MoreActions from '@/components/_shared/more-actions/MoreActions';
import { OutlinePopover } from '@/components/_shared/outline';
import { useOutlinePopover } from '@/components/_shared/outline/outline.hooks';
import BreadcrumbSkeleton from '@/components/_shared/skeleton/BreadcrumbSkeleton';
import { useAppHandlers, useBreadcrumb } from '@/components/app/app.hooks';
import { openOrDownload } from '@/utils/open_schema';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { ReactComponent as SideOutlined } from '@/assets/side_outlined.svg';
import { ReactComponent as Logo } from '@/assets/logo.svg';

import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Recent from 'src/components/app/recent/Recent';
import ShareButton from 'src/components/app/share/ShareButton';

interface AppHeaderProps {
  onOpenDrawer: () => void;
  drawerWidth: number;
  openDrawer: boolean;
  onCloseDrawer: () => void;
}

const HEADER_HEIGHT = 48;

export function AppHeader ({
  onOpenDrawer, openDrawer, onCloseDrawer,
}: AppHeaderProps) {
  const {
    openPopover, debounceClosePopover, handleOpenPopover, debounceOpenPopover, handleClosePopover,
  } = useOutlinePopover({
    onOpenDrawer, openDrawer, onCloseDrawer,
  });
  const { t } = useTranslation();
  const isTrash = window.location.pathname === '/app/trash';

  const crumbs = useBreadcrumb();

  const displayMenuButton = !openDrawer && window.innerWidth >= 480;

  const toView = useAppHandlers().toView;

  const recent = useMemo(() => <Recent />, []);

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
        {displayMenuButton && (
          <OutlinePopover
            {...{
              onMouseEnter: handleOpenPopover,
              onMouseLeave: debounceClosePopover,
            }}
            open={openPopover}
            onClose={debounceClosePopover}
            content={recent}
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
          {isTrash || crumbs && crumbs.length === 0 ? null :
            !crumbs ? <div className={'h-[48px] flex items-center'}><BreadcrumbSkeleton /></div> :
              <Breadcrumb
                toView={toView}
                variant={UIVariant.App}
                crumbs={crumbs}
              />}
        </div>
        <div className={'flex items-center gap-2'}>
          <MoreActions />
          <ShareButton />
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

export default memo(AppHeader);