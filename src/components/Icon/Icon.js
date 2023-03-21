//List of icons
import { ReactComponent as IconCalling } from "./icon-calling.svg";
import { ReactComponent as IconLocationDisabled } from "./icon-location-disabled.svg";
import { ReactComponent as IconPhone } from "./icon-phone.svg";
import { ReactComponent as IconRank } from "./icon-rank.svg";
import { ReactComponent as IconReviewNegative } from "./icon-review-negative.svg";
import { ReactComponent as IconReviewPositive } from "./icon-review-positive.svg";
import { ReactComponent as IconReview } from "./icon-review.svg";
import { ReactComponent as IconTarget } from "./icon-target.svg";

export function Icon(props) {
  const { name } = props;

  switch (name) {
    case "calling":
      return <IconCalling />;
    case "location-disabled":
      return <IconLocationDisabled />;
    case "phone":
      return <IconPhone />;
    case "rank":
      return <IconRank />;
    case "review-negative":
      return <IconReviewNegative />;
    case "review-positive":
      return <IconReviewPositive />;
    case "review":
      return <IconReview />;
    case "target":
      return <IconTarget />;
    default:
      return <></>;
  }
} /**/
