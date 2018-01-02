<?php

/**
 * @param $view_name
 * @param $view_display
 * @param $filters
 * @return string
 */
function getView($view_name,$view_display,$filters){
  $view = \Drupal\views\Views::getView($view_name);
  $view->setDisplay($view_display);
  $view->setExposedInput($filters);
  $render = $view->render();
  if(count($view->result)==0) return '';
  return \Drupal::service('renderer')->render($render);
}


/**
 * @param $node
 * @param $entityRef
 * @return mixed
 */
function getPromoPanel(&$node) {
  $panel = $node->get("field_promo_panel");
  if (!isset($panel)) {
    return '';
  }
  $entityRef = $panel->getValue();
  if (!isset($entityRef[0]['target_id'])) {
    return '';
  }
  $block_storage = \Drupal::entityTypeManager()->getStorage('block_content');
  $block = $block_storage->load($entityRef[0]['target_id']);

  $block_content = array();
  $block_content['#title'] = $block->get('field_title')->getValue()[0]['value'];
  $block_content['#text'] = $block->get('field_text')->getValue()[0]['value'];
  $block_content['#button_text'] = $block->get('field_button')->getValue()[0]['title'];
  $block_content['#button_url'] = \Drupal\Core\Url::fromUri($block->get('field_button')->getValue()[0]['uri']);

  $render = array(
    '#type' => 'container',
    "content" => $block_content,
    '#contextual_links' => array(
      'block_content' => array(
        'route_parameters' => array('block_content' => $entityRef[0]['target_id']),
      ),
    ),
    '#is_promo_panel' => TRUE
  );
  return \Drupal::service('renderer')->render($render);
}

/**
 * @return string
 */
function getTermsAsOptions($vid, $value = 0) {
  $options = '';
  $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid, 0, 1, TRUE);
  foreach ($terms as $term) {
    $selected = $term->id() == $value ? 'selected' : '';
    $options .= '<option value="' . $term->id() . '" ' . $selected . '>' . $term->getName() . '</option>';
  }
  return \Drupal\Core\Render\Markup::create($options);
}

/**
 * @param $variables
 * @param $term
 */
function getBannerImage(&$variables, $entity) {

  if (!isset($entity) || !$entity->hasField("field_banner")) {
    return;
  }
  $banner = $entity->get("field_banner");
  if (!isset($banner)) {
    return;
  }
  $entityRef = $banner->getValue();
  if (!isset($entityRef[0]['target_id'])) {
    return;
  }
  $media_storage = \Drupal::entityTypeManager()->getStorage('media');
  $media = $media_storage->load($entityRef[0]['target_id']);

  if (!$media) {
    return;
  }

  $style = Drupal\image\Entity\ImageStyle::load('banner');
  $variables['banner_big'] = $style->buildUrl($media->get("field_image")->entity->getFileUri());
  $style = Drupal\image\Entity\ImageStyle::load('banner_mobile');
  $variables['banner_small'] = $style->buildUrl($media->get("field_image_mobile")->entity->getFileUri());
  $variables['banner_class'] = 'title-banner--bg';

  return;
}
