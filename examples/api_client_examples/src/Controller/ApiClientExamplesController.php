<?php

declare(strict_types=1);

namespace Drupal\api_client_examples\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Returns responses for Api client examples routes.
 */
final class ApiClientExamplesController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function __invoke(): array {

    $build['content'] = [
      '#type' => 'item',
      '#markup' => $this->t('See dev console for output.'),
    ];
    $build['content']['#attached']['library'][] = 'api_client_examples/api_client_examples';

    return $build;
  }

}
