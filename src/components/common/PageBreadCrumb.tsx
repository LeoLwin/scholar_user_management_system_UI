import { Link } from "react-router";

interface BreadcrumbProps {
  pageTitle: string;
  links?: { name: string, path: string }[];

}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, links }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      {(links) ? (
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/"
              >
                Home
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            {links && (
              links.map((link, index) => (
                <li key={link.name}>
                  <Link to={link.path} className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">{link.name}
                    {index < (links.length - 1) && (
                      <svg
                        className="stroke-current"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                          stroke=""
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Link>
                </li>
              ))
            )}
          </ol>
        </nav>
      ) : ('')}
    </div>
  );
};

export default PageBreadcrumb;
