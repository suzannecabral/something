// React
import React, { useState } from "react";
import PropTypes from "prop-types";

// MUI
import { styled } from "@mui/material/styles";
import {
  IconButton,
  Typography,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Avatar,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
} from "@mui/icons-material";

/**
 * from MUI documentation, to expand the dropdown menu
 */
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

/**
 * given a comma separated list of tags, extract those delineated-dominant
 *
 * (maybe add other-weights to this function)
 *
 * @param {string} tags
 * @returns {object} { weights: [], newTags: []}
 */
const sortProductTags = (tags) => {
  let weights = [];
  let newTags = [];
  // sort the tags and note any stylistic weight (sativa=red, indica=blue)
  tags.split(",").forEach((t) => {
    const [a, b] = t.split("-");
    b && b === "dominant" ? weights.push(a) : newTags.push(t);
  });
  return { weights, newTags };
};

/**
 * will someone with better color vision expand upon this ?
 * @param {array} weights
 * @param {string} type
 * @returns {string} hex-color
 */
const determineColor = (weights, type) => {
  const score = { sativa: 0, hybrid: 0, indica: 0 };
  if (type === "hybrid") {
    score.hybrid = 1;
    score.indica += 50;
    score.sativa += 50;
  } else {
    score[type] += 50;
  }
  weights.forEach((lb) => (score[lb] += 125));
  return (
    "#" +
    [score.sativa, score.hybrid, score.indica]
      .map((c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

/**
 *
 * @param {*} props
 * @returns
 */
const ProductListItem = ({
  id,
  name,
  description,
  image_url,
  type,
  tags,
  selected,
  selectProduct,
  unSelectProduct,
}) => {
  // mui toggler
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  const { weights, newTags } = sortProductTags(tags);
  const bgcolor = determineColor(weights, type);
  return (
    <Card
      className="product-list-item"
      key={id}
      id={id}
      sx={{ width: 345 }}
      raised={selected}
      zdepth={1}
      onMouseOver={() => selectProduct(id)}
      onMouseOut={() => unSelectProduct(id)}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor }} aria-label="recipe">
            M
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={type}
      />
      <CardMedia
        component="img"
        height="194"
        image={image_url}
        alt={"image of " + name + " medicinal plant"}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {newTags.join(", ")}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>about {name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
ProductListItem.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  image_url: PropTypes.string,
  type: PropTypes.string,
  selected: PropTypes.bool,
  selectProduct: PropTypes.func,
  unSelectProduct: PropTypes.func,
};

/**
 * Products
 * @param {*} props
 */
const Products = ({
  products,
  selectProduct,
  unSelectProduct,
}) => {
  return (
    <>
      <div className="div-products">
        {products.map((p) =>
          ProductListItem({ ...p, selectProduct, unSelectProduct })
        )}
      </div>
    </>
  );
};

Products.propTypes = {
  products: PropTypes.array,
  selectProduct: PropTypes.func,
  unSelectProduct: PropTypes.func,
};

export default Products;
