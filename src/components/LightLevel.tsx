interface LightLevelProps {
  isBright: boolean;
  value: number;     // raw analog value
  light: number;     // calculated light % or level
}

const LightLevel = ({ isBright, value, light }: LightLevelProps) => {
  return (
    <div
      className={`p-4 rounded-xl shadow-md border w-full max-w-sm 
        ${isBright ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-100 border-gray-300'}
      `}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Light Level</h2>
      <div className="flex items-center space-x-3 mb-1">
        <div
          className={`w-3 h-3 rounded-full ${
            isBright ? 'bg-yellow-500' : 'bg-gray-600'
          }`}
        ></div>
        <span
          className={`text-md font-medium ${
            isBright ? 'text-yellow-700' : 'text-gray-700'
          }`}
        >
          {isBright ? 'Bright' : 'Dim'}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        Raw Value: <span className="font-medium text-gray-800">{value}</span>
      </p>
      <p className="text-sm text-gray-600">
        Light Level: <span className="font-medium text-gray-800">{light}%</span>
      </p>
    </div>
  );
};

export default LightLevel;
