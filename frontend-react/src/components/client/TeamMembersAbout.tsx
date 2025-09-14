
const teamMembers = [
  {
    name: "Fidan Abdullayeva",
    role: "CEO & Founder",
    description: "Fidan founded LuxStay in 2018 with a vision to transform the apartment rental experience.",
    imageUrl: "https://res.cloudinary.com/dfmfv6zox/image/upload/v1757872425/Screenshot_2025-09-14_214218_m5ngk5.png",
  },
  {
    name: "Laman Rzali",
    role: "Chief Operations Officer",
    description: "Laman oversees all operational aspects of LuxStay, ensuring exceptional service for hosts and guests alike.",
    imageUrl: "https://res.cloudinary.com/dfmfv6zox/image/upload/v1757872400/Screenshot_2025-09-14_214445_ugcsdq.png",
  },
  {
    name: "Elnur Khalilov",
    role: "Chief Technology Officer",
    description: "Elnur leads our technology team, building innovative solutions to make apartment rentals seamless.",
    imageUrl: "https://res.cloudinary.com/dfmfv6zox/image/upload/v1757872392/Screenshot_2025-09-14_214511_rfqufh.png",
  },
  {
    name: "Orkhan Aslanov",
    role: "Head of Customer Experience",
    description: "Orkhan is dedicated to creating memorable experiences for every LuxStay guest and host.",
    imageUrl: "https://res.cloudinary.com/dfmfv6zox/image/upload/v1757872415/Screenshot_2025-09-14_214410_pegorq.png",
  },
];

const TeamMembersAbout = () => {
  return (
<section className="py-10 text-center">
  <h2 className="mb-10 text-3xl font-bold">Meet the Team</h2>
  <div className="flex justify-center gap-10 flex-wrap">
    {teamMembers.map((member) => (
      <div key={member.name} className="max-w-xs text-center">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-36 h-36 rounded-full object-cover mb-5 mx-auto"
        />
        <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
        <p className=" text-gray-500 mb-4">{member.role}</p>
        <p className="text-sm text-gray-700">{member.description}</p>
      </div>
    ))}
  </div>
</section>
  );
};

export default TeamMembersAbout;