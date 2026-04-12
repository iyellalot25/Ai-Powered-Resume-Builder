function Header({ name, title, email, location }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
      {/* Avatar circle — shows initials */}
      <div
        className="w-20 h-20 rounded-full bg-indigo-100 flex items-center 
                      justify-center mx-auto mb-4"
      >
        <span className="text-2xl font-bold text-indigo-600">
          {/* .charAt(0) grabs the first letter — your initials */}
          {name.charAt(0) /*JS inside jsx */}
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
      <p className="text-indigo-500 font-medium mt-1">{title}</p>

      {/* Contact info row */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
        <span>📧 {email}</span>
        <span>📍 {location}</span>
      </div>
    </div>
  );
}

export default Header;
