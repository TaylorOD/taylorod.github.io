// These are vertical segments at one floor position, not whole image bounding boxes.
// Sources describe reference objects. They do not identify furniture in the painting.
const sofa='https://www.hermanmiller.com/content/dam/hermanmiller/documents/product_literature/product_sheets/Eames_Sofa_product_sheet.pdf';
const desk='https://www.ikea.com/de/en/p/micke-desk-white-30213076/';
const cabinet='https://passport.bandainamco-am.com/Ecommerce/category/commercial-games/pac-mans-pixel-bash-coin-op';
const door='https://www.simpsondoor.com/product-approvals/Default.aspx';
const mark=(room,id,label,ground,top,heightCm,note,source=null,confidence='estimated',tolerance=.1)=>({room,id,label,ground,top,heightCm,note,source,confidence,tolerance});
export const landmarks=[
  mark('town','arcade-door','Arcade door',[1304,555],[1304,505],203,'Door leaf only. The marquee is not part of the door.',door),
  mark('town','wilma-door','Wilma entrance',[135,558],[135,505],203,'Entrance leaf. The tall building above is a separate landmark.',door),
  mark('town','shop-door','Shop entrance',[605,555],[605,483],203,'Estimated opening. Check its upper edge against the painting.',door),
  mark('town','cabin-door','Distant house door',[1416,251],[1416,212],203,'The hill currently has no separate depth rule. This exposes that scale mismatch.',door),
  mark('town','bench-seat','River bench seat',[568,649],[568,638],45,'Seat surface directly above its near leg. Design target.'),
  mark('town','carousel','Carousel pavilion',[284,955],[284,812],550,'Approximate pavilion height target. This is not a surveyed Missoula dimension.',null,'estimated',.15),
  mark('town','wilma-building','Wilma building',[146,558],[146,174],1600,'Placeholder only. Requires a verified building height and an architectural floor anchor.',null,'unknown'),
  mark('arcade','cabinet','Rear cabinet',[238,246],[238,136],176,'Reference upright cabinet. The painting is taller than this reference.',cabinet,'visible'),
  mark('arcade','stool','Cabinet stool seat',[238,260],[238,232],45,'Near seat edge and the foot directly below it. Design target.',null,'visible'),
  mark('arcade','bar','Short bar return',[350,492],[350,423],105,'Vertical front face. Staff remain left of this return. Design target.',null,'visible'),
  mark('arcade','poker','Poker table edge',[590,348],[590,320],75,'Table edge over a front leg. Design target.'),
  mark('arcade','pinball','Pinball controls',[142,278],[142,229],95,'Ground under the control edge is partly hidden. Design target.'),
  mark('cabin','sofa','Couch back at front face',[280,444],[280,386],83.8,'Do not measure from the far cushion to the near feet. The reference sofa is 33 inches tall.',sofa,'visible'),
  mark('cabin','desk','Desk front edge',[695,392],[695,334],75,'Near desktop edge directly above its front leg.',desk,'visible'),
  mark('cabin','keyboard','Keyboard surface',[640,369],[640,312],75,'Ground directly below the keyboard is estimated because the desk hides it.',desk),
  mark('cabin','chair','Desk chair seat',[639,382],[639,344],45,'Seat over its near leg. Design target.'),
  mark('cabin','shelf','Bookshelf',[384,304],[384,160],190,'A 190 cm bookcase is the design target, not a measured product.'),
  mark('cabin','bed','Dog bed rim',[292,325],[292,313],15,'Front rim only. The ellipse includes floor depth. Design target.'),
  mark('rooftop','bench','Bench seat',[188,303],[188,281],45,'Near seat edge over the front leg. Design target.'),
  mark('rooftop','table','Cafe table',[552,314],[552,282],75,'Table edge above the pedestal. Design target.'),
  mark('rooftop','rear-guard','Rear parapet and rail',[384,268],[384,217],110,'Roof floor immediately beneath the rear guard. Design target, not a code certification.'),
  mark('rooftop','front-guard','Front parapet and rail',[384,403],[384,389],110,'The painted front guard barely rises above the roof floor. It needs an art correction, not smaller people.',null,'estimated'),
];
