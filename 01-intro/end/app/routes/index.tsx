export default function Index() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-4xl text-white">Work journal</h1>
      <p className="mt-3 text-xl text-gray-400">
        Doings and learnings. Updated weekly.
      </p>

      <div className="mt-8">
        <ul>
          <li>
            <p>
              Week of Feb 2<sup>nd</sup>, 2023
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <p>Work:</p>
                <ul className="ml-6 list-disc">
                  <li>First thing</li>
                </ul>
              </div>
              <div>
                <p>Learnings:</p>
                <ul className="ml-6 list-disc">
                  <li>First learning</li>
                  <li>Second learning</li>
                </ul>
              </div>
              <div>
                <p>Interesting things:</p>
                <ul className="ml-6 list-disc">
                  <li>Something cool!</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
