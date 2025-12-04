import Button from "../../common/Button";
interface DomoProp {
  domoUrl: string;
  domoHeadline?: string;
}
const Domo = ({ domoHeadline, domoUrl }: DomoProp) => {
  return (
    <div className="mb-16 md:mb-20">
      <h3 className="heading-3 !font-bold text-white mb-8">{domoHeadline}</h3>
      <div className="bg-transparent rounded-2xl p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        <div className="flex-1 order-2 lg:order-1">
          <h4 className="heading-4 !font-bold text-white mb-4">
            Verified Data is Just a Click Away
          </h4>
          <p className="body-text text-white leading-relaxed mb-10">
            Use the Media Institute’s “Data Desk” to browse public opinion
            findings and trend data on an interactive dashboard.
          </p>

          <Button variant="light-blue" showArrow={true}>
            <a href={domoUrl}> See Data Related to Your Search</a>
          </Button>
        </div>
        <div className="flex-1 order-1 lg:order-2">
          <div className="relative rounded-lg overflow-hidden bg-gray-700 h-64 md:h-80">
            <img
              src="/img/about2.jpg"
              alt="Data Desk"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Domo;
