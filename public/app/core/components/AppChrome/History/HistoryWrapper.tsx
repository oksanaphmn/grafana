import { css } from '@emotion/css';
import moment from 'moment';
import { useState } from 'react';

import { GrafanaTheme2, store } from '@grafana/data';
import { Card, IconButton, Space, Stack, Text, useStyles2 } from '@grafana/ui';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';

import { HISTORY_LOCAL_STORAGE_KEY } from '../AppChromeService';
import { HistoryEntryApp } from '../types';

export function HistoryWrapper() {
  const history = store.getObject<HistoryEntryApp[]>(HISTORY_LOCAL_STORAGE_KEY, []);

  return (
    <div>
      {history.map((entry, index) => (
        <HistoryEntryAppView key={index} entry={entry} isFirst={index === 0} />
      ))}
    </div>
  );
}
interface ItemProps {
  entry: HistoryEntryApp;
  isFirst: boolean;
}

function HistoryEntryAppView({ entry, isFirst }: ItemProps) {
  const styles = useStyles2(getStyles);
  const [isExpanded, setIsExpanded] = useState(isFirst && entry.views.length > 0);
  const { breadcrumbs, views, time } = entry;

  return (
    <Stack direction="column" gap={1}>
      <Stack>
        {views.length > 0 ? (
          <IconButton
            name={isExpanded ? 'angle-down' : 'angle-right'}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Expand / collapse"
            className={styles.iconButton}
          />
        ) : (
          <Space h={2} />
        )}

        {breadcrumbs.map((breadcrumb, index) => {
          if (breadcrumb.id === HOME_NAV_ID) {
            return null;
          }
          return (
            <Text key={index}>
              {breadcrumb.text} {index !== breadcrumbs.length - 1 ? '> ' : ''}
            </Text>
          );
        })}
        <Text color="secondary">{moment(time).format('h:mm A')}</Text>
      </Stack>
      {isExpanded && (
        <div className={styles.expanded}>
          {views.map((view, index) => (
            <Card
              key={index}
              href={view.url}
              isCompact={true}
              className={view.url === window.location.href ? undefined : styles.card}
            >
              <Stack direction="column" gap={0}>
                <Text variant="bodySmall">{view.name}</Text>
                {view.description && (
                  <Text color="secondary" variant="bodySmall">
                    {view.description}
                  </Text>
                )}
              </Stack>
            </Card>
          ))}
        </div>
      )}
    </Stack>
  );
}
const getStyles = (theme: GrafanaTheme2) => {
  return {
    card: css({
      background: 'none',
    }),
    iconButton: css({
      margin: 0,
    }),
    expanded: css({
      display: 'flex',
      flexDirection: 'column',
      marginLeft: theme.spacing(5),
      gap: theme.spacing(1),
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        left: theme.spacing(-2),
        top: 0,
        height: '100%',
        width: '1px',
        background: theme.colors.border.weak,
      },
    }),
    innerWrapper: css({
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    grot: css({
      display: `flex`,
      alignItems: `center`,
      justifyContent: `center`,
      padding: theme.spacing(5, 0),

      img: {
        width: `186px`,
        height: `186px`,
      },
    }),
  };
};
