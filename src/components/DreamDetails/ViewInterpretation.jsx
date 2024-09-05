import Image from 'next/image';

const ViewInterpretation = ({ interpretation, oracle, isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  console.log("the interpretation: ", interpretation);

  function cleanHTML(interpretation) {
    // Remove everything before the first '<' and after the last '>'
    const start = interpretation.indexOf('<');
    const end = interpretation.lastIndexOf('>') + 1; // Include the '>'

    if (start !== -1 && end !== -1) {
        let cleanedHtml = interpretation.substring(start, end);

        // Modify <h2> tags to include the desired styles
        cleanedHtml = cleanedHtml.replace(/<h2>/g, '<h2 style="font-size: 1.5em; font-weight: 600;">');

        return cleanedHtml;
    }

    return interpretation; // In case there is no valid HTML, return as is
}

  // Clean the interpretation HTML content
  const cleanInterpretation = cleanHTML(interpretation.interpretation);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-15 text-white">
      <div className="rounded-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto bg-black hide-scrollbar">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Dream Interpretation by {oracle.oracleName}
        </h2>

        {/* Oracle Image */}
        <div className="text-center justify-center flex mb-4">
          <Image
            src={oracle.oraclePicture}
            alt={oracle.oracleName}
            className="w-48 h-48 rounded-full border-gold-small"
            width={100}
            height={100}
            unoptimized={true}
          />
        </div>

        {/* Interpretation Text */}
        <div className="text-gray-200 text-center">
          {/* Use dangerouslySetInnerHTML to render the cleaned HTML */}
          <div dangerouslySetInnerHTML={{ __html: cleanInterpretation }} />
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInterpretation;
