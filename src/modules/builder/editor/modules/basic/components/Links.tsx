import { Fragment, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { socialIcons } from '@/helpers/icons';

const SUPPORTED_NETWORKS = [
  { network: 'linkedin', label: 'LinkedIn' },
  { network: 'twitter', label: 'Twitter' },
  { network: 'github', label: 'Github' },
  { network: 'hackerrank', label: 'Hackerrank' },
  { network: 'hackerearth', label: 'HackerEarth' },
  { network: 'codechef', label: 'CodeChef' },
  { network: 'leetcode', label: 'Leetcode' },
  { network: 'cssbattle', label: 'CSSBattle' },
  { network: 'xing', label: 'Xing' },
  { network: 'researchgate', label: 'ResearchGate' },
  { network: 'googlescholar', label: 'Google Scholar' },
  { network: 'orcid', label: 'ORCID' },
] as const;

interface IProfileNetwork {
  network: string;
  username: string;
  url: string;
}

const normalizeNetwork = (network: string) => network.toLowerCase().replace(/[\s_-]/g, '');

const Links = ({
  basicTabs,
  onChangeHandler,
}: {
  basicTabs: { profiles?: IProfileNetwork[] };
  onChangeHandler: (value: IProfileNetwork[], key: string) => void;
}) => {
  const profiles = basicTabs.profiles ?? [];
  const networks = SUPPORTED_NETWORKS.map(
    ({ network }) =>
      profiles.find((profile) => normalizeNetwork(profile.network) === network) ?? {
        network,
        username: '',
        url: '',
      }
  );
  const unsupportedProfiles = profiles.filter(
    (profile) =>
      !SUPPORTED_NETWORKS.some(({ network }) => normalizeNetwork(profile.network) === network)
  );

  useEffect(() => {
    onChangeHandler([...networks, ...unsupportedProfiles], 'profiles');
    // oxlint-disable-next-line react/exhaustive-deps
  }, []);

  const onURLChange = (value: string, network: string) => {
    const updatedProfiles = networks.map((profile) =>
      normalizeNetwork(profile.network) === network ? { ...profile, network, url: value } : profile
    );
    onChangeHandler([...updatedProfiles, ...unsupportedProfiles], 'profiles');
  };

  return (
    <Fragment>
      {SUPPORTED_NETWORKS.map(({ network, label }) => {
        const Icon = socialIcons.get(network);
        const profile = networks.find((item) => normalizeNetwork(item.network) === network);
        return (
          <TextField
            key={network}
            label={label}
            variant="filled"
            value={profile?.url ?? ''}
            slotProps={{
              input: {
                startAdornment: Icon ? (
                  <InputAdornment position="start">
                    <Icon size={18} aria-hidden />
                  </InputAdornment>
                ) : undefined,
              },
            }}
            onChange={(event) => onURLChange(event.target.value, network)}
          />
        );
      })}
    </Fragment>
  );
};

export default Links;
