
const teamMembers = [
  {
    name: "Fidan Abdullayeva",
    role: "CEO & Founder",
    description: "Fidan founded LuxStay in 2018 with a vision to transform the apartment rental experience.",
    imageUrl: "https://media.licdn.com/dms/image/v2/D4E03AQGvrheu-LEDQA/profile-displayphoto-shrink_400_400/B4EZZwAKsCHkAg-/0/1745635816224?e=1752710400&v=beta&t=Yv4DLcIs6p9n5F8FzbFD1RGiq3r2JdEe7Yoap6iLo5E",
  },
  {
    name: "Laman Rzali",
    role: "Chief Operations Officer",
    description: "Laman oversees all operational aspects of LuxStay, ensuring exceptional service for hosts and guests alike.",
    imageUrl: "https://media.licdn.com/dms/image/v2/D4E03AQET3ACsrVoBaA/profile-displayphoto-shrink_800_800/B4EZXEiirsHcAc-/0/1742759145856?e=1752710400&v=beta&t=zaG9QZ1922Jw6k7a0hfijlVJ8mzUuPwIQlWp4BJOK9I",
  },
  {
    name: "Elnur Khalilov",
    role: "Chief Technology Officer",
    description: "Elnur leads our technology team, building innovative solutions to make apartment rentals seamless.",
    imageUrl: "https://i.ibb.co/zVt1nVSy/Screenshot-2025-05-16-210738.png",
  },
  {
    name: "Orkhan Aslanov",
    role: "Head of Customer Experience",
    description: "Orkhan is dedicated to creating memorable experiences for every LuxStay guest and host.",
    imageUrl: "https://media.licdn.com/dms/image/v2/D4E03AQEXajM6JOm5dQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1718279170264?e=1752710400&v=beta&t=F-ZLJGDML3xcnAvcwmPWPKpybBKThKC-mmNrFs59k9g",
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