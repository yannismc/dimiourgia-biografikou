import Image from '@/helpers/common/components/Image';

const persons = [
  {
    name: 'Sadanand Pai',
    role: 'Frontend Engineer',
    github: 'https://github.com/sadanandpai',
    linkedin: 'https://www.linkedin.com/in/sadanandpai/',
  },
  {
    name: 'Gopalakrishnan',
    role: 'Frontend Engineer',
    github: 'https://github.com/gopal1996',
    linkedin: 'https://www.linkedin.com/in/gopal1996',
  },
  {
    name: 'Vivek G',
    role: 'Product designer, UI developer',
    github: 'https://github.com/vivek-nexus',
    linkedin: 'https://www.linkedin.com/in/vivek-nexus',
  },
  {
    name: 'Siva K',
    role: 'Frontend Engineer',
    github: 'https://github.com/siva-kannan3',
    linkedin: 'https://www.linkedin.com/in/siva-kannan3/',
  },
];

const PersonCard = ({ children }: { children: React.ReactNode }) => (
  <div className="transition ease-in-out delay-100 duration-300 px-6 py-8 flex flex-col items-center text-center shadow hover:shadow-xl rounded-xl border-2 border-resume-50 hover:border-resume-100">
    {children}
  </div>
);

const ProfileSocial = ({
  name,
  github,
  linkedin,
}: {
  name: string;
  github: string;
  linkedin: string;
}) => (
  <div className="flex gap-4">
    <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`${name} — GitHub`}>
      <Image src="/icons/github.svg" alt="github" width="24" height="24" className="w-auto" />
    </a>
    <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name} — LinkedIn`}>
      <Image src="/icons/linkedin.svg" alt="linkedin" width="24" height="24" className="w-auto" />
    </a>
  </div>
);

export default function MaintainerProfile({ role }: { role: string }) {
  return (
    <PersonCard>
      <Image
        src="/contributors/yannismc.png"
        alt="Ioannis Axaopoulos"
        className="rounded-full object-cover"
        height="128"
        width="128"
      />
      <h3 className="text-resume-800 mt-4 text-xl font-bold">Ioannis Axaopoulos</h3>
      <p className="text-resume-400 mb-2">yannismc</p>
      <p className="text-resume-400 mb-6">{role}</p>
      <ProfileSocial
        name="Ioannis Axaopoulos"
        github="https://github.com/yannismc"
        linkedin="https://www.linkedin.com/in/axaojon/"
      />
    </PersonCard>
  );
}

export function OriginalCreators() {
  return (
    <>
      {persons.map((person) => (
        <PersonCard key={person.name}>
          <h4 className="text-resume-800 font-bold">{person.name}</h4>
          <p className="text-resume-400 mb-6">{person.role}</p>
          <ProfileSocial name={person.name} github={person.github} linkedin={person.linkedin} />
        </PersonCard>
      ))}
    </>
  );
}
