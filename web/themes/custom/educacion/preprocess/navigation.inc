<?php


/**
 * @param $menu_tree
 * @param $parameters
 * @return mixed
 */
function beauchamps_get_menu($menu_name) {
  $menu_tree = \Drupal::menuTree();
  $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
  $tree = $menu_tree->load($menu_name, $parameters);
  $manipulators = array(
    // Only show links that are accessible for the current user.
    array('callable' => 'menu.default_tree_manipulators:checkAccess'),
    // Use the default sorting of menu links.
    array('callable' => 'menu.default_tree_manipulators:generateIndexAndSort'),
  );
  $tree = $menu_tree->transform($tree, $manipulators);
  $menu = $menu_tree->build($tree);
  return \Drupal::service('renderer')->render($menu);
}

/**
 * @param $variables
 */
function beauchamps_get_breadcrumb(&$variables) {
  $menu_tree = \Drupal::menuTree();
  $parameters = $menu_tree->getCurrentRouteMenuTreeParameters('main');
  $activeTrail = array_reverse($parameters->activeTrail);
  $context = isset($variables['context']) ? $variables['context'] : '';

  $breadcrumb = new \Drupal\Core\Breadcrumb\Breadcrumb();
  $menu_link_manager = \Drupal::service('plugin.manager.menu.link');
  $links = Array(\Drupal\Core\Link::createFromRoute('Home', '<front>'));
  foreach ($activeTrail as $id) {
    if (!$id > '') {
      continue;
    }
    $link = $menu_link_manager->getInstance(['id' => $id]);
    $text = $link->getTitle();

    $url_object = $link->getUrlObject();

    $links[] = \Drupal\Core\Link::fromTextAndUrl($text, $url_object);
  }

  $last = array_pop($links);
  if ("/" . $last->getUrl()->getInternalPath() == \Drupal::service('path.current')->getPath()) {
    $last->setUrl(new \Drupal\Core\Url('<none>'));
  }
  array_push($links, $last);

  if (in_array($context, ['profiles', 'publications', 'practice_areas'])) {
    switch ($context) {
      case 'profiles':
        $text = $variables['node']->getTitle();
        break;
      case 'publications':
        $term = \Drupal\taxonomy\Entity\Term::load($variables['node']->get('field_type')[0]->target_id);
        $text = $term->getName();
        break;
      case 'practice_areas':
      case 'sectors':
        $tid = \Drupal::routeMatch()->getRawParameter('taxonomy_term');
        if(!$tid>0) return;
        $term = \Drupal\taxonomy\Entity\Term::load($tid);
        $text = $term->getName();
        break;
    }
    $extra = \Drupal\Core\Link::fromTextAndUrl($text, new \Drupal\Core\Url('<none>'));
    array_push($links, $extra);
  }

  $breadcrumb->setLinks($links);
  $bc_render = $breadcrumb->toRenderable();

  $variables['breadcrumb'] = \Drupal::service('renderer')->render($bc_render);
  $variables['section'] = beauchamps_get_section($activeTrail, $context);
}


/**
 * @param $trailIds
 * @param $node_type
 * @return static
 */
function beauchamps_get_section($trailIds, $context) {

  if (!empty($context) && in_array($context, ['publications','practice_areas']) && count($trailIds) > 1) {
    $id = array_pop($trailIds);
    return beauchamps_get_link_from_menu_item_id($id);
  }
  else {
    if (count($trailIds) > 2) {
      array_pop($trailIds);
      $id = array_pop($trailIds);
      return beauchamps_get_link_from_menu_item_id($id);
    }
    else {
      return \Drupal\Core\Link::fromTextAndUrl('Beauchamps', new \Drupal\Core\Url('<front>'));
    }
  }

}

function beauchamps_get_link_from_menu_item_id($id) {
  $menu_link_manager = \Drupal::service('plugin.manager.menu.link');
  $link = $menu_link_manager->getInstance(['id' => $id]);
  $text = $link->getTitle();
  $url_object = $link->getUrlObject();
  $section = \Drupal\Core\Link::fromTextAndUrl($text, $url_object);
  $section_render = $section->toRenderable();
  return \Drupal::service('renderer')->render($section_render);
}