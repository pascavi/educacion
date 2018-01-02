<?php

/**
 * @param $variables
 * @return mixed
 */
function beauchamps_get_page(&$variables) {
  $activeContexts = \Drupal::service('context.manager')->getActiveContexts();
  $variables['context'] = count($activeContexts) > 0 ? $activeContexts[0]->getName() : 'no-context';
  $variables['layout'] = 'layout--narrow';
  $variables['not_content_page'] =  false;
  switch ($variables['context']) {
    case 'our_people':
      $params = \Drupal::requestStack()->getCurrentRequest()->query->all();
      if (isset($params['name'])) {
        $variables['name'] = \Drupal\Component\Utility\Html::escape($params['name']);
      }
      $area = isset($params['area']) ? intval($params['area']) : 0;
      $sector = isset($params['sector']) ? intval($params['sector']) : 0;
      $variables['show_subtitle'] = TRUE;
      $variables['our_people'] = TRUE;
      $variables['practice_areas'] = getTermsAsOptions('practice_areas', $area);
      $variables['sectors'] = getTermsAsOptions('sectors', $sector);
      $variables['roles'] = getTermsAsOptions('roles');
      $people_view = views_embed_view('people_search', 'rest_export_1');
      $variables['people_data'] = \Drupal\Core\Render\Markup::create(\Drupal::service('renderer')->render($people_view)->__toString());
      break;
    case 'whats_new':
      $params = \Drupal::requestStack()->getCurrentRequest()->query->all();
      $type = isset($params['type']) ? intval($params['type']) : 0;
      $whats_new_view = views_embed_view('publications', 'rest_export_1');
      $variables['whats_new_data'] = \Drupal\Core\Render\Markup::create(\Drupal::service('renderer')->render($whats_new_view)->__toString());
      $variables['types'] = getTermsAsOptions('publication_types',$type);
      $years = '';
      foreach (array_reverse(range(2015, intval(date("Y")))) as $year) {
        $years .= "<option value=\"$year\">$year</option>";
      }
      $variables['years'] = \Drupal\Core\Render\Markup::create($years);
      break;
    case 'homepage':
      $node = $variables['node'];
      $style = Drupal\image\Entity\ImageStyle::load('homepage_banner');
      $variables['banner_big'] = $style->buildUrl($node->get("field_banner_image")->entity->getFileUri());
      $style = Drupal\image\Entity\ImageStyle::load('homepage_banner_mobile');
      $variables['banner_small'] = $style->buildUrl($node->get("field_banner_image")->entity->getFileUri());
      $style = Drupal\image\Entity\ImageStyle::load('homepage_image');
      $variables['people_big'] = $style->buildUrl($node->get("field_image")->entity->getFileUri());
      $style = Drupal\image\Entity\ImageStyle::load('homepage_mobile');
      $variables['people_small'] = $style->buildUrl($node->get("field_image_mobile")->entity->getFileUri());
      $areas = views_embed_view('services', 'areas');
      $variables['practice_areas'] = \Drupal::service('renderer')->render($areas);
      $sectors = views_embed_view('services', 'sectors');
      $variables['sectors'] = \Drupal::service('renderer')->render($sectors);
      break;
    case 'profiles':
      $node = $variables['node'];
      $areas = [];
      foreach ($node->get('field_main_practice_areas')->getValue() as $item) {
        $areas[] = \Drupal\taxonomy\Entity\Term::load($item['target_id'])->getName();
      }
      $variables['areas'] = implode(', ', $areas);
      $term = \Drupal\taxonomy\Entity\Term::load($node->get('field_role')[0]->target_id);
      $variables['role'] = $term->getName();
      if(isset($node->get('field_additional_role')[0])){
        $term = \Drupal\taxonomy\Entity\Term::load($node->get('field_additional_role')[0]->target_id);
        $variables['role'] .= ', '.$term->getName();
      }
      if (isset($node->get("field_banner_image")->entity)) {
        $style = Drupal\image\Entity\ImageStyle::load('profile_banner');
        $variables['banner_big'] = $style->buildUrl($node->get("field_banner_image")->entity->getFileUri());

      }
      if (isset($node->get("field_image")->entity)) {
        $style = Drupal\image\Entity\ImageStyle::load('profile_banner_mobile');
        $variables['banner_small'] = $style->buildUrl($node->get("field_image")->entity->getFileUri());
      }
      break;
    case 'current_opportunities':
      $opps_view = views_embed_view('current_opportunities', 'rest_export_1');
      $variables['current_opportunities_data'] = \Drupal\Core\Render\Markup::create(\Drupal::service('renderer')->render($opps_view)->__toString());
      $variables['roles'] = getTermsAsOptions('current_opportunities_roles');
      break;
    case 'practice_areas':
    case 'sectors':
      $tid = \Drupal::routeMatch()->getRawParameter('taxonomy_term');
      $term = \Drupal\taxonomy\Entity\Term::load($tid);
      getBannerImage($variables, $term);
      break;
    case 'site_search':
      $params = \Drupal::requestStack()->getCurrentRequest()->query->all();
      if (isset($params['keyword'])) {
        $variables['keyword'] = \Drupal\Component\Utility\Html::escape($params['keyword']);
      }
      $search_view = views_embed_view('site_search', 'rest_export_1');
      $variables['search_data'] = \Drupal\Core\Render\Markup::create(\Drupal::service('renderer')->render($search_view)->__toString());
      break;
    case 'sitemap':
      $variables['not_content_page'] = true;
      $variables['layout'] = 'layout--full-width';
      break;
    default:
      $variables['not_content_page'] = empty($variables['node']);

      break;
  }

}

