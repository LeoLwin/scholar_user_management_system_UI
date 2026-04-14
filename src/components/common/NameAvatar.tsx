const NameAvatar = ({ name = "User Name" }) => {
  const initial = name.charAt(0).toUpperCase();

  return (    
    <>{initial}</> 
  );
};

export default NameAvatar;